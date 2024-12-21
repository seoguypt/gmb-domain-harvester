export const cleanDomain = (domain: string): string => {
  let cleaned = domain.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '');
  
  const multiPartTlds = [
    'co.uk', 'com.au', 'co.nz', 'co.jp', 'co.in', 
    'com.br', 'com.mx', 'co.za', 'com.sg', 'com.hk',
    'com.tr', 'co.th', 'com.tw', 'com.cn', 'com.vn',
    'com.ph', 'com.my', 'com.ar', 'com.pe', 'com.ve',
    'com.co', 'com.ec', 'com.uy', 'com.py', 'com.bo',
    'com.gt', 'com.sv', 'com.hn', 'com.ni', 'com.cr',
    'com.pa', 'com.do', 'org.uk', 'net.au', 'org.au'
  ];
  
  for (const tld of multiPartTlds) {
    if (cleaned.endsWith(`.${tld}`)) {
      cleaned = cleaned.slice(0, -(tld.length + 1));
      console.log(`Found multi-part TLD: .${tld}, cleaned domain: ${cleaned}`);
      return cleaned;
    }
  }
  
  return cleaned.replace(/\.[^/.]+$/, '');
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
  if (!url) return '';
  
  let normalized = url.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
    .split('/')[0];
    
  normalized = normalized
    .replace(/\.wordpress\.com$/, '')
    .replace(/\.wixsite\.com$/, '')
    .replace(/\.squarespace\.com$/, '')
    .replace(/\.shopify\.com$/, '');
    
  console.log('Normalized domain:', normalized);
  return normalized;
};

export const domainsMatch = (domain1: string, domain2: string): boolean => {
  if (!domain1 || !domain2) return false;
  
  const norm1 = normalizeDomain(domain1);
  const norm2 = normalizeDomain(domain2);
  
  console.log(`Comparing domains:
    Domain 1: ${domain1} -> ${norm1}
    Domain 2: ${domain2} -> ${norm2}`);
  
  const exactMatch = norm1 === norm2 || 
                    `www.${norm1}` === norm2 || 
                    norm1 === `www.${norm2}`;
                    
  const containsMatch = norm1.includes(norm2) || norm2.includes(norm1);
  
  const result = exactMatch || containsMatch;
  console.log('Match result:', result);
  
  return result;
};