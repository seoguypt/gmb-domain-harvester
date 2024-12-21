export const cleanDomain = (domain: string): string => {
  // Remove protocol and www if present
  let cleaned = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Remove trailing slashes and spaces
  cleaned = cleaned.replace(/\/+$/, '').trim();
  
  // For UK domains, keep the .co.uk part but remove it for the business name
  if (cleaned.endsWith('.co.uk')) {
    return cleaned;
  }
  
  // For other domains, remove TLD
  return cleaned.split('.')[0];
};

export const cleanBusinessName = (domain: string): string => {
  // Remove protocol and www if present
  let cleaned = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Remove trailing slashes and spaces
  cleaned = cleaned.replace(/\/+$/, '').trim();
  
  // For UK domains, remove .co.uk
  cleaned = cleaned.replace(/\.co\.uk$/, '');
  
  // Remove other TLDs
  cleaned = cleaned.split('.')[0];
  
  return cleaned;
};

export const domainsMatch = (domain1: string, domain2: string): boolean => {
  const clean1 = cleanDomain(domain1).toLowerCase();
  const clean2 = cleanDomain(domain2).toLowerCase();
  return clean1 === clean2;
};
