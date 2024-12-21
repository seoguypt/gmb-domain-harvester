import { Building2, MapPin, Star } from "lucide-react";

interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
}

interface ListingResultProps {
  listing: GMBListing;
}

export function ListingResult({ listing }: ListingResultProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="h-px bg-border" />
      
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{listing.businessName}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{listing.address}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-muted-foreground" />
          <span>{listing.rating} / 5.0</span>
        </div>
        
        <div className="inline-flex">
          <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {listing.type}
          </span>
        </div>
      </div>
    </div>
  );
}