import { Card } from "../ui/card";
import { DollarSign, Hash } from "lucide-react";

interface DomainStatsProps {
  domainCount: number;
}

const PRICE_PER_DOMAIN = 0.025;

export function DomainStats({ domainCount }: DomainStatsProps) {
  const totalCost = domainCount * PRICE_PER_DOMAIN;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4 flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Hash className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Domains</p>
          <p className="text-2xl font-semibold">{domainCount}</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Estimated Cost</p>
          <p className="text-2xl font-semibold">
            ${totalCost.toFixed(2)}
            <span className="text-xs text-muted-foreground ml-1">
              (${PRICE_PER_DOMAIN.toFixed(3)}/domain)
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}
