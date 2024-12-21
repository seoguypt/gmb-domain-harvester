import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link as LinkIcon, ArrowLeft, Building2, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        .contains('listing', { matchType: 'website' });
      
      if (error) throw error;
      
      // Safely cast the data to ensure listing is of type GMBListing
      return (data as any[]).map(item => ({
        ...item,
        listing: item.listing as GMBListing
      })) as DomainCheck[];
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches?.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{match.domain}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{match.listing.businessName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{match.listing.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{match.listing.rating} / 5.0</span>
                    </div>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/place/?q=place_id:${match.listing.placeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <LinkIcon className="h-4 w-4" />
                    View on Google Maps
                  </a>
                  <div className="text-sm text-muted-foreground">
                    Checked on: {new Date(match.checked_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            {!matches?.length && (
              <div className="col-span-full text-center py-8">
                No website matches found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteMatches;