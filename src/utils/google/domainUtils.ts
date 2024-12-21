export const cleanDomain = (domain: string): string => {
  // Remove protocol and www
  let cleaned = domain.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, ''); // Remove trailing slashes
  
  return cleaned;
};

export const cleanBusinessName = (domain: string): string => {
  let name = domain.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\.co\.uk$/, '') // Remove .co.uk
    .replace(/\.[^/.]+$/, '') // Remove other TLDs
    .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
    .replace(/new/, '') // Remove 'new' prefix
    .replace(/rest/, ''); // Remove 'rest' if present
  
  const suffixes = [
    "ltd", "limited", "inc", "incorporated", "llc", "corp", "corporation",
    "co", "company", "services", "solutions", "group", "holdings", "enterprises",
    "funeral", "funerals", "directors", "homes"
  ];
  
  // Remove common business suffixes
  suffixes.forEach(suffix => {
    const suffixPattern = new RegExp(`\\b${suffix}\\b`, 'i');
    name = name.replace(suffixPattern, '');
  });
  
  return name.trim();
};

export const normalizeDomain = (url: string): string => {
  if (!url) return '';
  return url.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
    .split('/')[0];
};

export const domainsMatch = (domain1: string, domain2: string): boolean => {
  if (!domain1 || !domain2) return false;
  
  const norm1 = normalizeDomain(domain1);
  const norm2 = normalizeDomain(domain2);
  
  // Only return true for exact matches after normalization
  return norm1 === norm2;
};