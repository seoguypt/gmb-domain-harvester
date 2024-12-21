import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingResult } from "../domain-checker/ListingResult";
import { DomainResult } from "@/utils/google/types";

interface MatchesGridProps {
  matches: DomainResult[];
}

export function MatchesGrid({ matches }: MatchesGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {matches?.map((match) => (
        <Card key={match.domain}>
          <CardHeader>
            <CardTitle className="text-lg">{match.domain}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {match.listing && <ListingResult listing={match.listing} />}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Age:</span>{" "}
                {match.domainAge}
              </div>
              <div>
                <span className="text-muted-foreground">TLD:</span> {match.tld}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {!matches?.length && (
        <div className="col-span-full text-center py-8">
          No name matches found
        </div>
      )}
    </div>
  );
}