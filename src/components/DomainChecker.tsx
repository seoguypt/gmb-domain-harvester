import { useState } from "react";
import { Card } from "@/components/ui/card";
import { APIKeys } from "./domain-checker/APIKeys";
import { DomainInput } from "./domain-checker/DomainInput";
import { BulkResults } from "./domain-checker/BulkResults";
import { ProgressIndicator } from "./domain-checker/ProgressIndicator";
import { useDomainChecker } from "@/hooks/useDomainChecker";

export function DomainChecker() {
  const [domains, setDomains] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("AIzaSyDrdKNl-vB_wFSUIGfe-ipW2_o3YPZxrE4");
  const [ahrefsApiKey, setAhrefsApiKey] = useState("");
  
  const {
    isLoading,
    isInitializing,
    results,
    progress,
    isApiInitialized,
    initializeApi,
    checkDomains,
  } = useDomainChecker();

  const handleCheck = () => {
    checkDomains(domains, ahrefsApiKey);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-2xl p-8 glass-card animate-fadeIn">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Domain Checker</h1>
            <p className="text-muted-foreground">
              Check if domains have active Google My Business listings
            </p>
          </div>

          <div className="space-y-4">
            <APIKeys
              googleApiKey={googleApiKey}
              setGoogleApiKey={setGoogleApiKey}
              ahrefsApiKey={ahrefsApiKey}
              setAhrefsApiKey={setAhrefsApiKey}
              isInitializing={isInitializing}
              onInitialize={() => initializeApi(googleApiKey)}
              isApiInitialized={isApiInitialized}
            />

            <DomainInput
              domains={domains}
              setDomains={setDomains}
              isLoading={isLoading}
              isApiInitialized={isApiInitialized}
              onCheck={handleCheck}
            />

            <ProgressIndicator isLoading={isLoading} progress={progress} />
          </div>

          {results.length > 0 && <BulkResults results={results} />}
        </div>
      </Card>
    </div>
  );
}