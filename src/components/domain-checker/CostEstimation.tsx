import { useMemo } from "react";

interface CostEstimationProps {
  domainCount: number;
}

export function CostEstimation({ domainCount }: CostEstimationProps) {
  const costEstimate = useMemo(() => {
    // Places API (New) pricing (as of 2024):
    // Basic Place Search: $5 per 1000 requests
    // Basic Place Details: $5 per 1000 requests
    const searchCostPer1000 = 5;
    const detailsCostPer1000 = 5;
    
    // Each domain check uses:
    // 1 Basic Place Search request
    // 1 Basic Place Details request (if search finds a result)
    // We'll assume 50% of domains find a result for estimation
    const searchCost = (domainCount * searchCostPer1000) / 1000;
    const detailsCost = (domainCount * 0.5 * detailsCostPer1000) / 1000;
    
    const totalCost = searchCost + detailsCost;
    return totalCost.toFixed(2);
  }, [domainCount]);

  if (domainCount === 0) return null;

  return (
    <div className="text-sm text-muted-foreground">
      <p>Estimated API cost for {domainCount} domain{domainCount !== 1 ? 's' : ''}: ${costEstimate}</p>
      <p className="text-xs mt-1">
        Based on Places API (New) pricing: $5/1000 requests for Basic Search and Basic Details
      </p>
    </div>
  );
}