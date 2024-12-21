import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BulkResults } from "@/components/domain-checker/BulkResults";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Found = () => {
  const [results, setResults] = useState<{ domain: string; listing: any; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFoundDomains = async () => {
    const { data, error } = await supabase
      .from('domain_checks')
      .select('*')
      .not('listing', 'is', null)
      .contains('listing', { matchType: 'website' })
      .order('checked_at', { ascending: false });

    if (error) {
      console.error('Error fetching found domains:', error);
      return;
    }

    const formattedResults = data.map(item => ({
      domain: item.domain,
      listing: item.listing
    }));

    setResults(formattedResults);
    setIsLoading(false);
  };

  const clearAllData = async () => {
    try {
      const { error } = await supabase
        .from('domain_checks')
        .delete()
        .contains('listing', { matchType: 'website' });

      if (error) throw error;

      setResults([]);
      toast({
        title: "Success",
        description: "All website matches have been cleared",
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error",
        description: "Failed to clear website matches",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFoundDomains();
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
            <Button
              variant="destructive"
              onClick={clearAllData}
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

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading website matches...</p>
          ) : results.length > 0 ? (
            <BulkResults results={results} />
          ) : (
            <p className="text-center text-muted-foreground">No website matches found yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Found;