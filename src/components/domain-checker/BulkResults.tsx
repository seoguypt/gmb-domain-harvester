import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Building2, MapPin, Star, Link, Globe } from 'lucide-react';
import type { DomainResult } from "@/utils/google/types";
import { domainsMatch } from "@/utils/google/domainUtils";

interface BulkResultsProps {
  results: DomainResult[];
}

export function BulkResults({ results }: BulkResultsProps) {
  return (
    <div className="w-full mt-6 animate-fadeIn overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>GMB Listing</TableHead>
            <TableHead>Match Type</TableHead>
            <TableHead>Domain Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{result.domain}</TableCell>
              <TableCell>
                {result.listing ? (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <a 
                        href={`https://www.google.com/maps/place/?q=place_id:${result.listing.placeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary cursor-pointer hover:underline"
                      >
                        <Link className="h-4 w-4" />
                        Yes
                      </a>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{result.listing.businessName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{result.listing.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span>{result.listing.rating} / 5.0</span>
                        </div>
                        {result.listing.matchType === 'name' && result.listing.websiteUrl && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={result.listing.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {result.listing.websiteUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </TableCell>
              <TableCell>
                {result.listing?.matchType ? (
                  <span className={`px-2.5 py-1 rounded-full text-sm capitalize ${
                    result.listing.matchType === 'website' 
                      ? 'bg-[#F2FCE2] text-green-700'
                      : 'bg-[#FEF7CD] text-amber-700'
                  }`}>
                    {result.listing.matchType}
                  </span>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {result.domainAge}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}