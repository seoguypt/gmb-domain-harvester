import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { APIKeyInput } from "./domain-checker/APIKeyInput";
import { DomainInput } from "./domain-checker/DomainInput";
import { BulkResults } from "./domain-checker/BulkResults";
import { Header } from "./domain-checker/Header";
import { useGoogleMapsInit } from "../hooks/useGoogleMapsInit";
import { useDomainChecker } from "../context/DomainCheckerContext";

export function DomainChecker() {
  const {
    apiKey,
    setApiKey,
    isInitializing,
    isApiInitialized,
    initializeApi,
  } = useGoogleMapsInit("AIzaSyDrdKNl-vB_wFSUIGfe-ipW2_o3YPZxrE4");

  const {
    domains,
    setDomains,
    isLoading,
    results,
    setResults,
    progress,
    checkDomains,
  } = useDomainChecker();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-2xl p-8 glass-card animate-fadeIn">
        <div className="space-y-8">
          <Header onClearComplete={() => setResults([])} />

          <div className="space-y-4">
            <APIKeyInput
              apiKey={apiKey}
              setApiKey={setApiKey}
              isInitializing={isInitializing}
              onInitialize={initializeApi}
              isApiInitialized={isApiInitialized}
            />

            <DomainInput
              domains={domains}
              setDomains={setDomains}
              isLoading={isLoading}
              isApiInitialized={isApiInitialized}
              onCheck={() => checkDomains(isApiInitialized)}
            />

            {isLoading && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Checking domains... {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>

          {results.length > 0 && <BulkResults results={results} isLoading={isLoading} />}
        </div>
      </Card>
    </div>
  );
}
