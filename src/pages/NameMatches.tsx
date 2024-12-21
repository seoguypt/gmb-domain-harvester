import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BulkResults } from "@/components/domain-checker/BulkResults";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

const NameMatches = () => {
  const [results, setResults] = useState<{ domain: string; listing: any; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNameMatches = async () => {
      const { data, error } = await supabase
        .from('domain_checks')
        .select('*')
        .not('listing', 'is', null)
        .contains('listing', { matchType: 'name' })
        .order('checked_at', { ascending: false });

      if (error) {
        console.error('Error fetching name matches:', error);
        return;
      }

      const formattedResults = data.map(item => ({
        domain: item.domain,
        listing: item.listing
      }));

      setResults(formattedResults);
      setIsLoading(false);
    };

    fetchNameMatches();
  }, []);

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
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Name Matches</h1>
            <p className="text-muted-foreground">
              Domains with name-matched Google My Business listings
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading name matches...</p>
          ) : results.length > 0 ? (
            <BulkResults results={results} />
          ) : (
            <p className="text-center text-muted-foreground">No name matches found yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NameMatches;