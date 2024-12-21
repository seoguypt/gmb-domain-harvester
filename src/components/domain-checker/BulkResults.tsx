import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Building2, MapPin, Star, Link, Calendar, Building, Clock, Globe, Users, ArrowUpRight } from 'lucide-react';
import type { DomainResult } from "@/components/DomainChecker";

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
            <TableHead>Registration</TableHead>
            <TableHead>Domain Metrics</TableHead>
            <TableHead>Backlinks</TableHead>
            <TableHead>SEO Performance</TableHead>
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
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Registered: {result.domainAge || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Registrar: {result.registrar || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Expires: {result.expiryDate || 'N/A'}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>TLD: {result.tld || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {result.registered ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Referring Domains:</span> {result.backlinksInfo?.referringDomains || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Total Backlinks:</span> {result.backlinksInfo?.backlinks || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Dofollow Links:</span> {result.backlinksInfo?.dofollow || 'N/A'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Organic Position 1:</span> {result.metrics?.organic?.pos_1 || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Est. Traffic Value:</span> ${result.metrics?.organic?.estimated_paid_traffic_cost?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Total Keywords:</span> {result.metrics?.organic?.count?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}