import React from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSystemStatus, type ServiceStatus } from '@/hooks/useSystemStatus';
import { formatDistanceToNow } from 'date-fns';

const getStatusIcon = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'degraded':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'down':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'checking':
      return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'degraded':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'down':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'checking':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getStatusText = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return 'Operational';
    case 'degraded':
      return 'Degraded';
    case 'down':
      return 'Down';
    case 'checking':
      return 'Checking...';
    default:
      return 'Unknown';
  }
};

const getOverallStatusMessage = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return 'All systems operational';
    case 'degraded':
      return 'Some systems experiencing issues';
    case 'down':
      return 'Major system outage';
    case 'checking':
      return 'Checking system status...';
    default:
      return 'Unknown system status';
  }
};

interface SystemStatusMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  showControls?: boolean;
}

export const SystemStatusMonitor: React.FC<SystemStatusMonitorProps> = ({
  autoRefresh = true,
  refreshInterval = 30000,
  showControls = true
}) => {
  const { services, overallStatus, isChecking, checkAllServices, lastUpdated } = useSystemStatus(
    autoRefresh,
    refreshInterval
  );

  const lastUpdatedText = formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon(overallStatus)}
          <div>
            <h3 className="text-lg font-semibold">{getOverallStatusMessage(overallStatus)}</h3>
            <p className="text-sm text-muted-foreground">
              Last updated {lastUpdatedText}
            </p>
          </div>
        </div>
        
        {showControls && (
          <Button 
            onClick={checkAllServices} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Refresh'}
          </Button>
        )}
      </div>

      {/* Service Status List */}
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(service.status)}`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(service.status)}
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-sm opacity-75">{service.description}</div>
                {service.error && service.status !== 'operational' && (
                  <div className="text-xs mt-1 opacity-90 font-mono">
                    Error: {service.error}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {service.responseTime && (
                <Badge variant="outline" className="text-xs">
                  {service.responseTime}ms
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(service.status)}`}
              >
                {getStatusText(service.status)}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {services.filter(s => s.status === 'operational').length}
          </div>
          <div className="text-sm text-muted-foreground">Services Operational</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {services.filter(s => s.status === 'degraded').length}
          </div>
          <div className="text-sm text-muted-foreground">Services Degraded</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {services.filter(s => s.status === 'down').length}
          </div>
          <div className="text-sm text-muted-foreground">Services Down</div>
        </div>
      </div>

      {/* Average Response Time */}
      {services.some(s => s.responseTime) && (
        <div className="pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">
              {Math.round(
                services
                  .filter(s => s.responseTime)
                  .reduce((sum, s) => sum + (s.responseTime || 0), 0) /
                services.filter(s => s.responseTime).length
              )}ms
            </div>
            <div className="text-sm text-muted-foreground">Average Response Time</div>
          </div>
        </div>
      )}

      {autoRefresh && (
        <div className="text-center text-xs text-muted-foreground">
          Auto-refreshing every {Math.floor(refreshInterval / 1000)} seconds
        </div>
      )}
    </div>
  );
};

export default SystemStatusMonitor;