import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface ListingResultProps {
  listing: {
    name: string;
    address: string;
    placeId: string;
    domain?: string;
  };
}

export function ListingResult({ listing }: ListingResultProps) {
  const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${listing.placeId}`;

  return (
    <div className="space-y-2">
      <p className="font-medium">{listing.name}</p>
      <p className="text-sm text-muted-foreground">{listing.address}</p>
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
  );
}