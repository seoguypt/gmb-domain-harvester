import { Card } from "../ui/card";
import { useDomainChecker } from "../../context/DomainCheckerContext";
import { BarChart, Clock, Hash, Percent } from "lucide-react";

export function Stats() {
  const { results, websiteMatches, nameMatches } = useDomainChecker();
  
  const totalDomains = results.length;
  const websiteMatchCount = websiteMatches.length;
  const nameMatchCount = nameMatches.length;
  
  const websiteMatchRate = totalDomains ? ((websiteMatchCount / totalDomains) * 100).toFixed(1) : '0';
  const nameMatchRate = totalDomains ? ((nameMatchCount / totalDomains) * 100).toFixed(1) : '0';
  const totalMatchRate = totalDomains ? (((websiteMatchCount + nameMatchCount) / totalDomains) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Hash className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Domains</p>
          <p className="text-2xl font-semibold">{totalDomains}</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <BarChart className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Website Matches</p>
          <p className="text-2xl font-semibold">
            {websiteMatchCount}
            <span className="text-sm text-muted-foreground ml-2">
              ({websiteMatchRate}%)
            </span>
          </p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <BarChart className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Name Matches</p>
          <p className="text-2xl font-semibold">
            {nameMatchCount}
            <span className="text-sm text-muted-foreground ml-2">
              ({nameMatchRate}%)
            </span>
          </p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Percent className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Match Rate</p>
          <p className="text-2xl font-semibold">{totalMatchRate}%</p>
        </div>
      </Card>
    </div>
  );
}
