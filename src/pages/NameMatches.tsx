import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ViewToggle } from "@/components/name-matches/ViewToggle";
import { MatchesTable } from "@/components/name-matches/MatchesTable";
import { MatchesGrid } from "@/components/name-matches/MatchesGrid";
import { DomainResult } from "@/utils/google/types";

export default function NameMatches() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const { data: matches, isLoading } = useQuery({
    queryKey: ['name-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domain_checks')
        .select('*')
        .not('listing', 'is', null)
        .contains('listing', { matchType: 'name' });
      
      if (error) throw error;

      // Transform the data to match DomainResult type
      return data.map(item => ({
        domain: item.domain,
        listing: item.listing as any,
        tld: item.domain.split('.').pop() || '',
        domainAge: 'Unknown', // You might want to calculate this based on your needs
      })) as DomainResult[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Name Matches</h1>
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === 'table' ? (
        <MatchesTable matches={matches || []} />
      ) : (
        <MatchesGrid matches={matches || []} />
      )}
    </div>
  );
}