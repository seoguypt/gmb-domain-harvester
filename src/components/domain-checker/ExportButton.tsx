import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { exportToCSV, formatMatchesForExport } from "../../utils/exportUtils";

interface ExportButtonProps {
  results: any[];
  filename: string;
}

export function ExportButton({ results, filename }: ExportButtonProps) {
  const handleExport = () => {
    const formattedData = formatMatchesForExport(results);
    exportToCSV(formattedData, filename);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className="gap-2"
      disabled={results.length === 0}
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
