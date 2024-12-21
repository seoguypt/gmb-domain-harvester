export const cleanDomain = (domain: string): string => {
  return domain.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
    .replace(/\.[^/.]+$/, '');
};

export const cleanBusinessName = (domain: string): string => {
  let name = cleanDomain(domain);
  
  const suffixes = [
    "ltd", "limited", "inc", "incorporated", "llc", "corp", "corporation",
    "co", "company", "services", "solutions", "group", "holdings", "enterprises"
  ];
  
  suffixes.forEach(suffix => {
    const suffixPattern = new RegExp(`[-_]?${suffix}$`);
    name = name.replace(suffixPattern, '');
  });
  
  name = name.replace(/[-_]/g, ' ');
  
  return name.trim();
};

export const normalizeDomain = (url: string): string => {
  return url.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .split('/')[0];
};

export const domainsMatch = (domain1: string, domain2: string): boolean => {
  const norm1 = normalizeDomain(domain1);
  const norm2 = normalizeDomain(domain2);
  
  return norm1 === norm2 || 
         `www.${norm1}` === norm2 || 
         norm1 === `www.${norm2}`;
};