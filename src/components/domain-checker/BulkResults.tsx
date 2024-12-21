import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Building2, MapPin, Star, Link } from "lucide-react";

interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
}

interface BulkResultsProps {
  results: {
    domain: string;
    listing: GMBListing | null;
  }[];
}

export function BulkResults({ results }: BulkResultsProps) {
  return (
    <div className="w-full mt-6 animate-fadeIn">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>GMB Listing</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.domain}</TableCell>
              <TableCell>
                {result.listing ? (
                  <HoverCard>
                    <HoverCardTrigger className="flex items-center gap-2 text-primary cursor-pointer">
                      <Link className="h-4 w-4" />
                      Yes
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}