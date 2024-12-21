import { Button } from "@/components/ui/button";
import { Building2, MapPin, Star } from "lucide-react";

interface ListingResultProps {
  listing: {
    name: string;
    address: string;
    placeId: string;
    domain?: string;
    rating?: number;
    type?: string;
  };
}

export function ListingResult({ listing }: ListingResultProps) {
  const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${listing.placeId}`;

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="h-px bg-border" />
      
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{listing.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{listing.address}</span>
        </div>
        
        {listing.rating && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-muted-foreground" />
            <span>{listing.rating} / 5.0</span>
          </div>
        )}
        
        {listing.type && (
          <div className="inline-flex">
            <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {listing.type}
            </span>
          </div>
        )}

        {listing.domain && (
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            asChild
          >
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              {listing.domain}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}