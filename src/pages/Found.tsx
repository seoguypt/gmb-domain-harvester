import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BulkResults } from "../components/domain-checker/BulkResults";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useDomainChecker } from "../context/DomainCheckerContext";

const Found = () => {
  const { websiteMatches, clearWebsiteMatches } = useDomainChecker();

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="max-w-2xl mx-auto p-8 glass-card animate-fadeIn">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={clearWebsiteMatches}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Website Matches</h1>
            <p className="text-muted-foreground">
              Domains with website-matched Google My Business listings
            </p>
          </div>

          {websiteMatches.length > 0 ? (
            <BulkResults results={websiteMatches} isLoading={false} />
          ) : (
            <p className="text-center text-muted-foreground">No website matches found yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Found;
