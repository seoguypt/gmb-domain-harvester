import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListingResult } from "../domain-checker/ListingResult";
import { DomainResult } from "@/utils/google/types";

interface MatchesTableProps {
  matches: DomainResult[];
}

export function MatchesTable({ matches }: MatchesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Business Details</TableHead>
          <TableHead>Domain Age</TableHead>
          <TableHead>TLD</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches?.map((match) => (
          <TableRow key={match.domain}>
            <TableCell>{match.domain}</TableCell>
            <TableCell>
              {match.listing && <ListingResult listing={match.listing} />}
            </TableCell>
            <TableCell>{match.domainAge}</TableCell>
            <TableCell>{match.tld}</TableCell>
          </TableRow>
        ))}
        {!matches?.length && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              No name matches found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}