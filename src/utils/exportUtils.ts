interface ExportData {
  domain: string;
  businessName: string;
  address: string;
  rating: number;
  type: string;
  matchType: string;
  websiteUrl?: string;
  placeId: string;
}

export function exportToCSV(data: ExportData[], filename: string) {
  const headers = [
    'Domain',
    'Business Name',
    'Address',
    'Rating',
    'Type',
    'Match Type',
    'Website URL',
    'Place ID'
  ];

  const rows = data.map(item => [
    item.domain,
    item.businessName,
    item.address,
    item.rating,
    item.type,
    item.matchType,
    item.websiteUrl || '',
    item.placeId
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatMatchesForExport(results: any[]): ExportData[] {
  return results
    .filter(result => result.listing)
    .map(result => ({
      domain: result.domain,
      businessName: result.listing.businessName,
      address: result.listing.address,
      rating: result.listing.rating,
      type: result.listing.type,
      matchType: result.listing.matchType,
      websiteUrl: result.listing.websiteUrl,
      placeId: result.listing.placeId
    }));
}
