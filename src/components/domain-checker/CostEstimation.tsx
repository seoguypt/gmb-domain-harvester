import { useMemo } from "react";

interface CostEstimationProps {
  domainCount: number;
}

export function CostEstimation({ domainCount }: CostEstimationProps) {
  const costEstimate = useMemo(() => {
    // Google Maps Places API pricing (as of 2024):
    // Text Search: $17 per 1000 requests
    // Place Details: $17 per 1000 requests
    const textSearchCostPer1000 = 17;
    const placeDetailsCostPer1000 = 17;
    
    // Each domain check uses:
    // 1 Text Search request
    // 1 Place Details request (if text search finds a result)
    // We'll assume 50% of domains find a result for estimation
    const textSearchCost = (domainCount * textSearchCostPer1000) / 1000;
    const placeDetailsCost = (domainCount * 0.5 * placeDetailsCostPer1000) / 1000;
    
    const totalCost = textSearchCost + placeDetailsCost;
    return totalCost.toFixed(2);
  }, [domainCount]);

  if (domainCount === 0) return null;

  return (
    <div className="text-sm text-muted-foreground">
      <p>Estimated API cost for {domainCount} domain{domainCount !== 1 ? 's' : ''}: ${costEstimate}</p>
      <p className="text-xs mt-1">
        Based on Google Maps API pricing: $17/1000 requests for Text Search and Place Details
      </p>
    </div>
  );
}