import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingResult } from "@/components/domain-checker/ListingResult";
import { Database } from "lucide-react";

const FoundOnes = () => {
  const { data: foundOnes, isLoading } = useQuery({
    queryKey: ["foundOnes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domain_checks")
        .select("*")
        .not("listing", "is", null);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading found ones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Database className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Found</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {foundOnes?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.domain}</CardTitle>
            </CardHeader>
            <CardContent>
              {item.listing && <ListingResult listing={item.listing as any} />}
            </CardContent>
          </Card>
        ))}
      </div>

      {foundOnes?.length === 0 && (
        <p className="text-center text-muted-foreground">
          No matches found yet. Try checking some domains first.
        </p>
      )}
    </div>
  );
};

export default FoundOnes;