import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Building2, MapPin, Star, Link, ExternalLink } from "lucide-react";
import { SearchFilter } from "./SearchFilter";
import { SortableHeader } from "./SortableHeader";
import { useSort } from "../../hooks/useSort";

interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
}

interface BulkResultsProps {
  results: {
    domain: string;
    listing: GMBListing | null;
  }[];
  isLoading: boolean;
}

export function BulkResults({ results, isLoading }: BulkResultsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = useMemo(() => {
    if (!searchTerm) return results;
    
    const term = searchTerm.toLowerCase();
    return results.filter(result => 
      result.domain.toLowerCase().includes(term) || 
      result.listing?.businessName.toLowerCase().includes(term)
    );
  }, [results, searchTerm]);

  const { items: sortedResults, sortConfig, requestSort } = useSort(filteredResults);

  return (
    <div className="w-full mt-6 animate-fadeIn relative space-y-4">
      {isLoading && (
        <div className="absolute -top-6 left-0 text-sm text-muted-foreground">
          Checking domains...
        </div>
      )}
      
      {!isLoading && results.length > 0 && (
        <>
          <SearchFilter value={searchTerm} onChange={setSearchTerm} />
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader
                  label="Domain"
                  sortKey="domain"
                  currentKey={sortConfig.key}
                  direction={sortConfig.direction}
                  onSort={requestSort}
                />
                <SortableHeader
                  label="GMB Listing"
                  sortKey="listing.businessName"
                  currentKey={sortConfig.key}
                  direction={sortConfig.direction}
                  onSort={requestSort}
                />
                <SortableHeader
                  label="Match Type"
                  sortKey="listing.matchType"
                  currentKey={sortConfig.key}
                  direction={sortConfig.direction}
                  onSort={requestSort}
                />
                <SortableHeader
                  label="Check Domain"
                  sortKey=""
                  currentKey={sortConfig.key}
                  direction={sortConfig.direction}
                  onSort={requestSort}
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.domain}</TableCell>
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
                            <div className="inline-flex">
                              <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                {result.listing.type}
                              </span>
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
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.listing.matchType === 'website' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.listing.matchType === 'website' ? 'Website Match' : 'Name Match'}
                        </span>
                        {result.listing.matchType === 'name' && result.listing.websiteUrl && (
                          <div className="text-xs text-muted-foreground">
                            <a 
                              href={result.listing.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {result.listing.websiteUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://majestic.com/reports/site-explorer?q=${result.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Majestic
                      </a>
                      <span className="text-muted-foreground">|</span>
                      <a
                        href={`https://app.ahrefs.com/v2-site-explorer/overview?mode=subdomains&target=${result.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ahrefs
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
