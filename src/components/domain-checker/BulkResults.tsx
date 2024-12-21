import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Building2, MapPin, Star, Link, ExternalLink, BarChart } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import type { DomainResult } from "@/utils/google/types";
import { domainsMatch } from "@/utils/google/domainUtils";
import { Button } from "@/components/ui/button";

interface BulkResultsProps {
  results: DomainResult[];
}

export function BulkResults({ results }: BulkResultsProps) {
  const websiteMatches = results.filter(r => r.listing?.matchType === 'website').length;

  return (
    <div className="w-full mt-6 animate-fadeIn space-y-4">
      {websiteMatches > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <RouterLink to="/website-matches" className="flex items-center gap-2">
              <span>View All Website Matches</span>
              <ExternalLink className="h-4 w-4" />
            </RouterLink>
          </Button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6">Domain</TableHead>
              <TableHead className="w-1/4">GMB Listing</TableHead>
              <TableHead className="w-1/6">Match Type</TableHead>
              <TableHead className="w-1/4">SEO Metrics</TableHead>
              <TableHead>Check</TableHead>
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
                          <div className="flex flex-col">
                            <span>Yes</span>
                            {result.listing.websiteUrl && !domainsMatch(result.domain, result.listing.websiteUrl) && (
                              <span className="text-xs text-muted-foreground">
                                {result.listing.websiteUrl}
                              </span>
                            )}
                          </div>
                        </a>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{result.listing.businessName}</span>
                            </div>
                            {result.listing.websiteUrl && !domainsMatch(result.domain, result.listing.websiteUrl) && (
                              <div className="flex items-center gap-2 pl-6">
                                <span className="text-xs text-muted-foreground">
                                  Using domain: {result.listing.websiteUrl}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{result.listing.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span>{result.listing.rating} / 5.0</span>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {result.listing?.matchType && (
                    <div className="space-y-1">
                      <span className={`px-2.5 py-1 rounded-full text-sm capitalize ${
                        result.listing.matchType === 'website' 
                          ? 'bg-[#F2FCE2] text-green-700'
                          : 'bg-[#FEF7CD] text-amber-700'
                      }`}>
                        {result.listing.matchType === 'name' ? 'Name match' : result.listing.matchType}
                      </span>
                      {result.listing.websiteUrl && !domainsMatch(result.domain, result.listing.websiteUrl) && (
                        <div className="text-xs text-muted-foreground pl-1">
                          Using domain: {result.listing.websiteUrl}
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <BarChart className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            {result.semrush_rank ? (
                              <span className="text-sm">SR: {result.semrush_rank.toLocaleString()}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">SR: N/A</span>
                            )}
                            {result.facebook_shares ? (
                              <span className="text-sm">FB: {result.facebook_shares.toLocaleString()}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">FB: N/A</span>
                            )}
                            {result.ahrefs_rank ? (
                              <span className="text-sm">AR: {result.ahrefs_rank.toLocaleString()}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">AR: N/A</span>
                            )}
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">SEO Metrics</p>
                          <div className="space-y-1">
                            <p className="text-sm">SemRush Rank: {result.semrush_rank?.toLocaleString() || 'N/A'}</p>
                            <p className="text-sm">Facebook Shares: {result.facebook_shares?.toLocaleString() || 'N/A'}</p>
                            <p className="text-sm">Ahrefs Rank: {result.ahrefs_rank?.toLocaleString() || 'N/A'}</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <a 
                      href={`https://majestic.com/reports/site-explorer?q=${result.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Majestic</span>
                    </a>
                    <a 
                      href={`https://app.ahrefs.com/v2-site-explorer/overview?mode=subdomains&target=${result.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Ahrefs</span>
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}