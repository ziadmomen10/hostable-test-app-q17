import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Globe, 
  Key, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface LanguageCoverage {
  code: string;
  name: string;
  percentage: number;
  translated: number;
  total: number;
}

interface CoverageStats {
  totalElements: number;
  elementsWithKeys: number;
  keysCoverage: number;
  languageCoverage: LanguageCoverage[];
}

interface TranslationCoverageBannerProps {
  coverageStats: CoverageStats | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onBulkAssign?: () => void;
  compact?: boolean;
}

export const TranslationCoverageBanner: React.FC<TranslationCoverageBannerProps> = ({
  coverageStats,
  isLoading = false,
  onRefresh,
  onBulkAssign,
  compact = false
}) => {
  if (!coverageStats) return null;
  
  const { totalElements, elementsWithKeys, keysCoverage, languageCoverage } = coverageStats;
  const missingKeys = totalElements - elementsWithKeys;
  
  // Get top 3 languages for compact display
  const topLanguages = [...languageCoverage]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);
  
  // Status icon and color based on coverage
  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
    if (percentage >= 50) return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />;
    return <XCircle className="h-3.5 w-3.5 text-red-500" />;
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/50 border-b text-xs">
        <div className="flex items-center gap-1.5">
          <Key className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Keys:</span>
          <span className={`font-medium ${keysCoverage >= 100 ? 'text-green-600' : keysCoverage >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
            {keysCoverage}%
          </span>
          {missingKeys > 0 && (
            <Badge variant="outline" className="h-4 px-1 text-[10px] border-red-200 text-red-600 bg-red-50">
              {missingKeys} missing
            </Badge>
          )}
        </div>
        
        <span className="text-muted-foreground">|</span>
        
        <div className="flex items-center gap-2">
          {topLanguages.map(lang => (
            <div key={lang.code} className="flex items-center gap-1">
              <Badge variant="outline" className="h-4 px-1 text-[10px] font-mono">
                {lang.code.toUpperCase()}
              </Badge>
              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${getProgressColor(lang.percentage)}`}
                  style={{ width: `${lang.percentage}%` }}
                />
              </div>
              <span className={`text-[10px] font-medium ${lang.percentage >= 100 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {lang.percentage}%
              </span>
            </div>
          ))}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] gap-1">
              <Globe className="h-3 w-3" />
              View All
              <ChevronDown className="h-2.5 w-2.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <FullCoverageView 
              coverageStats={coverageStats} 
              onRefresh={onRefresh}
              onBulkAssign={onBulkAssign}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-card border rounded-lg space-y-4">
      <FullCoverageView 
        coverageStats={coverageStats} 
        onRefresh={onRefresh}
        onBulkAssign={onBulkAssign}
      />
    </div>
  );
};

interface FullCoverageViewProps {
  coverageStats: CoverageStats;
  onRefresh?: () => void;
  onBulkAssign?: () => void;
}

const FullCoverageView: React.FC<FullCoverageViewProps> = ({
  coverageStats,
  onRefresh,
  onBulkAssign
}) => {
  const { totalElements, elementsWithKeys, keysCoverage, languageCoverage } = coverageStats;
  const missingKeys = totalElements - elementsWithKeys;
  
  return (
    <div className="space-y-4">
      {/* Key Coverage Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Translation Keys
          </h4>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh} className="h-6 px-2">
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Elements with keys</span>
            <span className="font-medium">
              {elementsWithKeys} / {totalElements}
            </span>
          </div>
          <Progress value={keysCoverage} className="h-2" />
          
          {missingKeys > 0 ? (
            <div className="flex items-center justify-between">
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {missingKeys} elements need translation keys
              </p>
              {onBulkAssign && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onBulkAssign}
                  className="h-6 text-xs"
                >
                  <Key className="h-3 w-3 mr-1" />
                  Assign Keys
                </Button>
              )}
            </div>
          ) : (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              All elements have translation keys
            </p>
          )}
        </div>
      </div>
      
      {/* Language Coverage Section */}
      <div className="border-t pt-3">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Language Coverage
        </h4>
        
        <div className="space-y-2.5 max-h-48 overflow-y-auto">
          {languageCoverage.map(lang => {
            const isComplete = lang.percentage >= 100;
            const isMostlyComplete = lang.percentage >= 75;
            
            return (
              <div key={lang.code} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <Badge 
                      variant="outline" 
                      className={`h-5 px-1.5 text-[10px] font-mono ${
                        isComplete ? 'bg-green-50 border-green-200 text-green-700' : ''
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </Badge>
                    <span className="truncate max-w-[100px]">{lang.name}</span>
                  </span>
                  <span className={`text-xs font-medium ${
                    isComplete ? 'text-green-600' : 
                    isMostlyComplete ? 'text-yellow-600' : 
                    'text-muted-foreground'
                  }`}>
                    {lang.translated}/{lang.total}
                    <span className="ml-1 opacity-75">({lang.percentage}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${
                      isComplete ? 'bg-green-500' : 
                      isMostlyComplete ? 'bg-yellow-500' : 
                      lang.percentage >= 25 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {languageCoverage.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            No languages configured
          </p>
        )}
      </div>
    </div>
  );
};

export default TranslationCoverageBanner;
