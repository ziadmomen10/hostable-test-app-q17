import React from 'react';
import { usePriceConversion } from '@/hooks/usePriceConversion';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  baseCurrency?: 'USD';
  decimals?: number;
  showOriginal?: boolean;
  showCode?: boolean;
  className?: string;
  originalClassName?: string;
}

/**
 * Component to display prices converted to the user's local currency
 * Prices are stored in USD and automatically converted based on geo-detection or user preference
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  baseCurrency = 'USD',
  decimals = 2,
  showOriginal = false,
  showCode = false,
  className,
  originalClassName,
}) => {
  const { format, formatWithCode, code, isLoading } = usePriceConversion({ decimals });

  // If still loading, show a subtle placeholder
  if (isLoading) {
    return (
      <span className={cn('animate-pulse', className)}>
        ---
      </span>
    );
  }

  const formattedPrice = showCode ? formatWithCode(amount) : format(amount);
  const isUSD = code === 'USD';

  return (
    <span className={cn(className)}>
      {formattedPrice}
      {showOriginal && !isUSD && (
        <span className={cn('text-muted-foreground ml-1 text-sm', originalClassName)}>
          (${amount.toFixed(decimals)} {baseCurrency})
        </span>
      )}
    </span>
  );
};

/**
 * Component to display a price with strikethrough (for discounts)
 */
export const PriceStrikethrough: React.FC<{
  amount: number;
  decimals?: number;
  className?: string;
}> = ({ amount, decimals = 2, className }) => {
  const { format, isLoading } = usePriceConversion({ decimals });

  if (isLoading) {
    return <span className={cn('animate-pulse line-through', className)}>---</span>;
  }

  return (
    <span className={cn('line-through', className)}>
      {format(amount)}
    </span>
  );
};

/**
 * Component to display savings amount
 */
export const PriceSavings: React.FC<{
  originalAmount: number;
  discountedAmount: number;
  decimals?: number;
  showPercentage?: boolean;
  className?: string;
}> = ({ originalAmount, discountedAmount, decimals = 2, showPercentage = true, className }) => {
  const { format, isLoading } = usePriceConversion({ decimals });

  if (isLoading) {
    return <span className={cn('animate-pulse', className)}>---</span>;
  }

  const savings = originalAmount - discountedAmount;
  const percentage = Math.round((savings / originalAmount) * 100);

  return (
    <span className={cn(className)}>
      Save {format(savings)}
      {showPercentage && ` (${percentage}%)`}
    </span>
  );
};

export default PriceDisplay;
