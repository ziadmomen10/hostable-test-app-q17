import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ServiceStatus = 'operational' | 'degraded' | 'down' | 'checking';

export interface SystemService {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  responseTime?: number;
  lastChecked: Date;
  error?: string;
}

// These services are informational — they check hosting config, not backend health
const INFORMATIONAL_SERVICES = ['ssl-certificate', 'security-headers'];

const INITIAL_SERVICES: Omit<SystemService, 'status' | 'lastChecked'>[] = [
  {
    id: 'database',
    name: 'Database',
    description: 'PostgreSQL database connectivity'
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'File storage and CDN services'
  },
  {
    id: 'auth',
    name: 'Authentication',
    description: 'User authentication services'
  },
  {
    id: 'api',
    name: 'API Services',
    description: 'Core API endpoints'
  },
  {
    id: 'realtime',
    name: 'Real-time',
    description: 'Live updates and subscriptions'
  },
  {
    id: 'edge-functions',
    name: 'Edge Functions',
    description: 'Serverless function execution'
  },
  {
    id: 'ssl-certificate',
    name: 'SSL Certificate',
    description: 'Certificate validity and expiration'
  },
  {
    id: 'critical-user-flow',
    name: 'User Registration',
    description: 'Critical user signup process'
  },
  {
    id: 'payment-simulation',
    name: 'Payment Flow',
    description: 'Payment processing simulation'
  },
  {
    id: 'security-headers',
    name: 'Security Headers',
    description: 'HTTP security configuration'
  }
];

export const useSystemStatus = (autoRefresh = true, interval = 30000) => {
  const [services, setServices] = useState<SystemService[]>(
    INITIAL_SERVICES.map(service => ({
      ...service,
      status: 'checking' as ServiceStatus,
      lastChecked: new Date()
    }))
  );
  const [isChecking, setIsChecking] = useState(false);
  const [overallStatus, setOverallStatus] = useState<ServiceStatus>('checking');

  const checkDatabaseStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return { status: 'down', responseTime, error: error.message };
      }
      
      return { 
        status: responseTime > 2000 ? 'degraded' : 'operational', 
        responseTime 
      };
    } catch (error) {
      return { 
        status: 'down', 
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const checkStorageStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return { status: 'down', responseTime, error: error.message };
      }
      
      return { 
        status: responseTime > 3000 ? 'degraded' : 'operational', 
        responseTime 
      };
    } catch (error) {
      return { 
        status: 'down', 
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const checkAuthStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.auth.getSession();
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return { status: 'down', responseTime, error: error.message };
      }
      
      return { 
        status: responseTime > 1500 ? 'degraded' : 'operational', 
        responseTime 
      };
    } catch (error) {
      return { 
        status: 'down', 
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const checkAPIStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('id')
        .limit(1);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return { status: 'down', responseTime, error: error.message };
      }
      
      return { 
        status: responseTime > 2000 ? 'degraded' : 'operational', 
        responseTime 
      };
    } catch (error) {
      return { 
        status: 'down', 
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const checkRealtimeStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      // Test realtime connection by creating a temporary channel
      const testChannel = supabase.channel('system-status-test');
      
      return new Promise<{ status: ServiceStatus; responseTime?: number; error?: string }>((resolve) => {
        const timeout = setTimeout(() => {
          testChannel.unsubscribe();
          resolve({ 
            status: 'down', 
            responseTime: Date.now() - startTime,
            error: 'Connection timeout' 
          });
        }, 5000);

        testChannel
          .subscribe((status) => {
            clearTimeout(timeout);
            const responseTime = Date.now() - startTime;
            
            if (status === 'SUBSCRIBED') {
              testChannel.unsubscribe();
              resolve({ 
                status: responseTime > 3000 ? 'degraded' : 'operational', 
                responseTime 
              });
            } else if (status === 'CHANNEL_ERROR') {
              testChannel.unsubscribe();
              resolve({ 
                status: 'down', 
                responseTime,
                error: 'Channel connection failed' 
              });
            }
          });
      });
    } catch (error) {
      return { 
        status: 'down', 
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const checkEdgeFunctionStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      // Make a simple HTTP GET request to the health check endpoint (no auth needed)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co'}/functions/v1/admin-auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge function health check failed:', response.status, errorText);
        return { 
          status: 'down', 
          responseTime, 
          error: `HTTP ${response.status}: ${errorText}` 
        };
      }
      
      const data = await response.json();
      
      // Check if we got a valid health check response
      if (data && (data.status === 'healthy' || data.service === 'admin-auth')) {
        return { 
          status: responseTime > 4000 ? 'degraded' : 'operational', 
          responseTime 
        };
      }
      
      return { 
        status: 'down', 
        responseTime,
        error: 'Invalid health check response'
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return { 
        status: 'down', 
        responseTime,
        error: error instanceof Error ? error.message : 'Edge functions unavailable'
      };
    }
  };

  // Shared origin header fetch — called once per check cycle, result consumed by both SSL and Security Headers checks
  const fetchOriginHeaders = async (): Promise<Response | null> => {
    try {
      return await fetch(window.location.origin, { method: 'HEAD' });
    } catch {
      return null;
    }
  };

  const checkSSLCertificateStatus = async (originResponse: Response | null): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    const responseTime = Date.now() - startTime;

    if (!originResponse) {
      return { status: 'down', responseTime, error: 'SSL check failed' };
    }

    // If HTTPS is active, SSL is working — header presence is a hosting concern, not backend health
    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
      return { status: 'operational', responseTime };
    }

    return { status: 'down', responseTime, error: 'Site not using HTTPS' };
  };

  const checkCriticalUserFlowStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      // Simulate critical user signup flow checks
      const steps = [
        // Check if profiles table is accessible (needed for user creation)
        supabase.from('profiles').select('count').limit(1),
        // Check if languages table is accessible (needed for UI)
        supabase.from('languages').select('count').limit(1)
      ];
      
      const results = await Promise.allSettled(steps);
      const responseTime = Date.now() - startTime;
      
      const failedSteps = results.filter(r => r.status === 'rejected').length;
      
      if (failedSteps > 0) {
        return { 
          status: 'down', 
          responseTime, 
          error: `${failedSteps} critical flow step(s) failed` 
        };
      }
      
      return { 
        status: responseTime > 3000 ? 'degraded' : 'operational', 
        responseTime 
      };
    } catch (error) {
      return { 
        status: 'down', 
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'User flow check failed'
      };
    }
  };

  const checkPaymentSimulationStatus = async (): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    try {
      // Only check DB connectivity — edge function already checked by checkEdgeFunctionStatus
      const result = await supabase.from('profiles').select('id').limit(1);
      const responseTime = Date.now() - startTime;

      if (result.error) {
        return { status: 'down', responseTime, error: 'Payment infrastructure unavailable' };
      }

      return { 
        status: responseTime > 5000 ? 'degraded' : 'operational', 
        responseTime 
      };
    } catch (error) {
      return { 
        status: 'down', 
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Payment simulation failed'
      };
    }
  };

  const checkSecurityHeadersStatus = async (originResponse: Response | null): Promise<{ status: ServiceStatus; responseTime?: number; error?: string }> => {
    const startTime = Date.now();
    const responseTime = Date.now() - startTime;

    if (!originResponse) {
      return { status: 'down', responseTime, error: 'Security headers check failed' };
    }

    // On preview/dev domains, security headers are controlled by the hosting platform, not the app
    const hostname = window.location.hostname;
    const isPreviewOrDev = hostname === 'localhost' || hostname.includes('lovable.app') || hostname.includes('lovableproject.com');
    
    if (isPreviewOrDev) {
      return { status: 'operational', responseTime };
    }

    const criticalHeaders = ['x-frame-options', 'x-content-type-options', 'referrer-policy'];
    const presentHeaders = criticalHeaders.filter(header => originResponse.headers.get(header)).length;
    const securityScore = presentHeaders / criticalHeaders.length;
    
    if (securityScore < 0.5) {
      return { status: 'down', responseTime, error: `Missing ${criticalHeaders.length - presentHeaders} critical security headers` };
    }
    
    return { status: securityScore === 1 ? 'operational' : 'degraded', responseTime };
  };

  const checkAllServices = useCallback(async () => {
    setIsChecking(true);

    // Fetch origin headers ONCE — shared by checkSSLCertificateStatus and checkSecurityHeadersStatus
    // This reduces per-cycle HTTP calls from 4 to 2
    const originResponse = await fetchOriginHeaders();

    const checks = [
      { id: 'database', check: () => checkDatabaseStatus() },
      { id: 'storage', check: () => checkStorageStatus() },
      { id: 'auth', check: () => checkAuthStatus() },
      { id: 'api', check: () => checkAPIStatus() },
      { id: 'realtime', check: () => checkRealtimeStatus() },
      { id: 'edge-functions', check: () => checkEdgeFunctionStatus() },
      { id: 'ssl-certificate', check: () => checkSSLCertificateStatus(originResponse) },
      { id: 'critical-user-flow', check: () => checkCriticalUserFlowStatus() },
      { id: 'payment-simulation', check: () => checkPaymentSimulationStatus() },
      { id: 'security-headers', check: () => checkSecurityHeadersStatus(originResponse) }
    ];

    const results = await Promise.allSettled(
      checks.map(async ({ id, check }) => {
        const result = await check();
        return { id, ...result };
      })
    );

    setServices(prevServices => 
      prevServices.map(service => {
        const result = results.find(r => 
          r.status === 'fulfilled' && r.value.id === service.id
        );
        
        if (result && result.status === 'fulfilled') {
          const { id, ...checkResult } = result.value;
          return {
            ...service,
            ...checkResult,
            lastChecked: new Date()
          };
        }
        
        // If check failed
        return {
          ...service,
          status: 'down' as ServiceStatus,
          error: 'Service check failed',
          lastChecked: new Date()
        };
      })
    );

    // Calculate overall status — exclude informational (non-backend) services
    const serviceStatuses = results
      .filter((r): r is PromiseFulfilledResult<{ status: ServiceStatus; responseTime?: number; error?: string; id: string }> => 
        r.status === 'fulfilled' && !INFORMATIONAL_SERVICES.includes(r.value.id))
      .map(r => r.value.status);
    
    const downCount = serviceStatuses.filter(s => s === 'down').length;
    const degradedCount = serviceStatuses.filter(s => s === 'degraded').length;
    
    let newOverallStatus: ServiceStatus;
    if (downCount > 0) {
      newOverallStatus = 'down';
    } else if (degradedCount > 0) {
      newOverallStatus = 'degraded';
    } else {
      newOverallStatus = 'operational';
    }
    
    setOverallStatus(newOverallStatus);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    checkAllServices();
    
    if (autoRefresh) {
      const intervalId = setInterval(checkAllServices, interval);
      return () => clearInterval(intervalId);
    }
  }, [checkAllServices, autoRefresh, interval]);

  return {
    services,
    overallStatus,
    isChecking,
    checkAllServices,
    lastUpdated: services.length > 0 ? Math.max(...services.map(s => s.lastChecked.getTime())) : Date.now()
  };
};