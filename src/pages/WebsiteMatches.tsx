import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link as LinkIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { GMBListing } from "@/utils/google/types";

interface DomainCheck {
  id: string;
  domain: string;
  checked_at: string;
  listing: GMBListing;
}

const WebsiteMatches = () => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['website-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domain_checks')
        .select('*')
        .not('listing', 'is', null)
        .eq('listing->matchType', 'website');
      
      if (error) throw error;
      return data as DomainCheck[];
    }
  });

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Website Matches</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading matches...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain Checked</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Website Used</TableHead>
                <TableHead>Checked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches?.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">{match.domain}</TableCell>
                  <TableCell>{match.listing.businessName}</TableCell>
                  <TableCell>
                    <a 
                      href={`https://www.google.com/maps/place/?q=place_id:${match.listing.placeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {match.listing.websiteUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    {new Date(match.checked_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {!matches?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No website matches found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default WebsiteMatches;