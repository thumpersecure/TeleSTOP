import * as https from 'https';
import * as http from 'http';
import { knownSites } from './knowledge-base';

export interface SearchResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  isPeopleSearchSite: boolean;
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

function isPeopleSearchSite(domain: string): boolean {
  const lowerDomain = domain.toLowerCase();
  return knownSites.some(site => lowerDomain.includes(site.toLowerCase()));
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    };

    const request = protocol.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        fetchUrl(response.headers.location).then(resolve).catch(reject);
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    });

    request.on('error', reject);
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function parseSearchResults(html: string): SearchResult[] {
  const results: SearchResult[] = [];

  // Pattern to find search result blocks
  // Google's HTML structure varies, so we use multiple patterns

  // Pattern 1: Look for result containers with links and snippets
  const resultPattern = /<a[^>]*href="\/url\?q=([^"&]+)[^"]*"[^>]*>.*?<h3[^>]*>([^<]+)<\/h3>/gs;
  const matches = html.matchAll(resultPattern);

  for (const match of matches) {
    try {
      const url = decodeURIComponent(match[1]);
      const title = match[2].replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));

      if (url.startsWith('http') && !url.includes('google.com')) {
        const domain = extractDomain(url);

        // Extract snippet (text near the result)
        const snippetMatch = html.substring(match.index || 0, (match.index || 0) + 2000)
          .match(/<span[^>]*class="[^"]*"[^>]*>([^<]{50,300})<\/span>/);
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').trim() : '';

        results.push({
          title: title.trim(),
          url,
          domain,
          snippet,
          isPeopleSearchSite: isPeopleSearchSite(domain),
        });
      }
    } catch {
      continue;
    }
  }

  // Pattern 2: Alternative pattern for different Google HTML structure
  if (results.length === 0) {
    const altPattern = /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>.*?<h3[^>]*>([^<]+)<\/h3>/gs;
    const altMatches = html.matchAll(altPattern);

    for (const match of altMatches) {
      try {
        const url = match[1];
        const title = match[2].replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));

        if (!url.includes('google.com') && !url.includes('youtube.com')) {
          const domain = extractDomain(url);

          results.push({
            title: title.trim(),
            url,
            domain,
            snippet: '',
            isPeopleSearchSite: isPeopleSearchSite(domain),
          });
        }
      } catch {
        continue;
      }
    }
  }

  // Pattern 3: Parse from cite elements and nearby content
  if (results.length === 0) {
    const citePattern = /<cite[^>]*>([^<]+)<\/cite>/g;
    const citeMatches = html.matchAll(citePattern);

    for (const match of citeMatches) {
      try {
        let url = match[1].replace(/<[^>]+>/g, '').trim();
        if (!url.startsWith('http')) {
          url = 'https://' + url;
        }

        const domain = extractDomain(url);
        if (domain && !domain.includes('google')) {
          // Try to find title nearby
          const nearbyText = html.substring(Math.max(0, (match.index || 0) - 500), (match.index || 0) + 500);
          const titleMatch = nearbyText.match(/<h3[^>]*>([^<]+)<\/h3>/);
          const title = titleMatch ? titleMatch[1] : domain;

          results.push({
            title: title.trim(),
            url,
            domain,
            snippet: '',
            isPeopleSearchSite: isPeopleSearchSite(domain),
          });
        }
      } catch {
        continue;
      }
    }
  }

  // Remove duplicates based on domain
  const seen = new Set<string>();
  return results.filter(result => {
    if (seen.has(result.url)) return false;
    seen.add(result.url);
    return true;
  });
}

export async function searchGoogle(query: string): Promise<SearchResult[]> {
  // Encode the query for URL
  const encodedQuery = encodeURIComponent(query);

  // Use Google search with number of results
  const searchUrl = `https://www.google.com/search?q=${encodedQuery}&num=50&hl=en`;

  try {
    const html = await fetchUrl(searchUrl);
    const results = parseSearchResults(html);

    // Sort results: people search sites first
    results.sort((a, b) => {
      if (a.isPeopleSearchSite && !b.isPeopleSearchSite) return -1;
      if (!a.isPeopleSearchSite && b.isPeopleSearchSite) return 1;
      return 0;
    });

    return results;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw new Error('Failed to fetch search results. Please try again.');
  }
}

// Format phone number in various formats for thorough searching
function generatePhoneVariants(phone: string): string[] {
  const variants: string[] = [];
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length === 10) {
    // Standard formats
    variants.push(`"${cleanPhone}"`);
    variants.push(`"${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}"`);
    variants.push(`"(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}"`);
    variants.push(`"${cleanPhone.slice(0, 3)}.${cleanPhone.slice(3, 6)}.${cleanPhone.slice(6)}"`);
    variants.push(`"${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}"`);
    // With +1 country code
    variants.push(`"+1${cleanPhone}"`);
    variants.push(`"1-${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}"`);
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
    const num = cleanPhone.slice(1);
    variants.push(`"${cleanPhone}"`);
    variants.push(`"${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}"`);
    variants.push(`"(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}"`);
  } else {
    variants.push(`"${phone}"`);
    variants.push(`"${cleanPhone}"`);
  }

  return variants;
}

// Generate name variants for searching
function generateNameVariants(fullName: string): string[] {
  const variants: string[] = [];
  const parts = fullName.trim().split(/\s+/);

  // Exact full name
  variants.push(`"${fullName}"`);

  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleParts = parts.slice(1, -1);

    // First Last
    variants.push(`"${firstName} ${lastName}"`);

    // Last, First
    variants.push(`"${lastName}, ${firstName}"`);

    // First initial + Last
    variants.push(`"${firstName[0]}. ${lastName}"`);
    variants.push(`"${firstName[0]} ${lastName}"`);

    // If middle name exists
    if (middleParts.length > 0) {
      const middleName = middleParts[0];
      // First Middle Last
      variants.push(`"${firstName} ${middleName} ${lastName}"`);
      // First M. Last
      variants.push(`"${firstName} ${middleName[0]}. ${lastName}"`);
      // First M Last
      variants.push(`"${firstName} ${middleName[0]} ${lastName}"`);
    }
  }

  return [...new Set(variants)]; // Remove duplicates
}

// Generate address variants for searching
function generateAddressVariants(address: string): string[] {
  const variants: string[] = [];

  // Original address
  variants.push(`"${address}"`);

  // Common abbreviation replacements
  const abbreviations: [RegExp, string][] = [
    [/\bStreet\b/gi, 'St'],
    [/\bSt\b/gi, 'Street'],
    [/\bAvenue\b/gi, 'Ave'],
    [/\bAve\b/gi, 'Avenue'],
    [/\bDrive\b/gi, 'Dr'],
    [/\bDr\b/gi, 'Drive'],
    [/\bRoad\b/gi, 'Rd'],
    [/\bRd\b/gi, 'Road'],
    [/\bBoulevard\b/gi, 'Blvd'],
    [/\bBlvd\b/gi, 'Boulevard'],
    [/\bLane\b/gi, 'Ln'],
    [/\bLn\b/gi, 'Lane'],
    [/\bCourt\b/gi, 'Ct'],
    [/\bCt\b/gi, 'Court'],
    [/\bCircle\b/gi, 'Cir'],
    [/\bCir\b/gi, 'Circle'],
    [/\bApartment\b/gi, 'Apt'],
    [/\bApt\b/gi, 'Apartment'],
    [/\bSuite\b/gi, 'Ste'],
    [/\bSte\b/gi, 'Suite'],
    [/\bNorth\b/gi, 'N'],
    [/\bSouth\b/gi, 'S'],
    [/\bEast\b/gi, 'E'],
    [/\bWest\b/gi, 'W'],
  ];

  // Generate variants with different abbreviations
  for (const [pattern, replacement] of abbreviations) {
    if (pattern.test(address)) {
      const variant = address.replace(pattern, replacement);
      if (variant !== address) {
        variants.push(`"${variant}"`);
      }
    }
  }

  // Just the street number and name (first part before comma or city)
  const streetPart = address.split(',')[0].trim();
  if (streetPart !== address) {
    variants.push(`"${streetPart}"`);
  }

  return [...new Set(variants)]; // Remove duplicates
}

// Generate search queries from personal info with multiple formats
export function generateSearchQueries(info: {
  fullName?: string;
  emails?: string[];
  phones?: string[];
  addresses?: string[];
  city?: string;
  state?: string;
}): string[] {
  const queries: string[] = [];

  // Name queries with variations
  if (info.fullName) {
    const nameVariants = generateNameVariants(info.fullName);

    for (const variant of nameVariants) {
      // Basic name search
      queries.push(variant);

      // Name + site:people-search-sites
      queries.push(`${variant} site:spokeo.com OR site:whitepages.com OR site:beenverified.com`);
      queries.push(`${variant} site:truepeoplesearch.com OR site:fastpeoplesearch.com`);

      // Name + address/phone keywords
      queries.push(`${variant} address phone`);
      queries.push(`${variant} "personal information"`);
      queries.push(`${variant} "public records"`);
      queries.push(`${variant} "background check"`);

      // Name + city/state if provided
      if (info.city) {
        queries.push(`${variant} "${info.city}"`);
      }
      if (info.state) {
        queries.push(`${variant} "${info.state}"`);
      }
      if (info.city && info.state) {
        queries.push(`${variant} "${info.city}, ${info.state}"`);
        queries.push(`${variant} "${info.city}" "${info.state}"`);
      }
    }
  }

  // Email queries
  if (info.emails) {
    for (const email of info.emails) {
      queries.push(`"${email}"`);
      queries.push(`"${email}" -site:${email.split('@')[1]}`); // Exclude the email provider
      queries.push(`"${email}" "personal information"`);

      // Email with name
      if (info.fullName) {
        queries.push(`"${email}" "${info.fullName}"`);
      }
    }
  }

  // Phone queries with format variations
  if (info.phones) {
    for (const phone of info.phones) {
      const phoneVariants = generatePhoneVariants(phone);
      for (const variant of phoneVariants) {
        queries.push(variant);
      }

      // Phone with name
      if (info.fullName) {
        const cleanPhone = phone.replace(/\D/g, '');
        queries.push(`"${phone}" "${info.fullName}"`);
        if (cleanPhone.length === 10) {
          queries.push(`"${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}" "${info.fullName}"`);
        }
      }
    }
  }

  // Address queries with variations
  if (info.addresses) {
    for (const address of info.addresses) {
      const addressVariants = generateAddressVariants(address);
      for (const variant of addressVariants) {
        queries.push(variant);
      }

      // Address with name
      if (info.fullName) {
        queries.push(`"${address}" "${info.fullName}"`);
      }
    }
  }

  // Deduplicate and return
  return [...new Set(queries)];
}

// Generate targeted queries for people search sites
export function generatePeopleSearchQueries(info: {
  fullName?: string;
  city?: string;
  state?: string;
}): string[] {
  const queries: string[] = [];
  const sites = [
    'spokeo.com',
    'whitepages.com',
    'beenverified.com',
    'truepeoplesearch.com',
    'fastpeoplesearch.com',
    'radaris.com',
    'instantcheckmate.com',
    'truthfinder.com',
    'peoplefinder.com',
    'mylife.com',
    'nuwber.com',
    'usphonebook.com',
    'thatsthem.com',
    'familytreenow.com',
    'peekyou.com',
  ];

  if (info.fullName) {
    // Search across all major people search sites
    for (const site of sites) {
      queries.push(`site:${site} "${info.fullName}"`);
      if (info.state) {
        queries.push(`site:${site} "${info.fullName}" "${info.state}"`);
      }
      if (info.city && info.state) {
        queries.push(`site:${site} "${info.fullName}" "${info.city}, ${info.state}"`);
      }
    }

    // Batch site searches (more efficient)
    const siteBatch1 = sites.slice(0, 5).map(s => `site:${s}`).join(' OR ');
    const siteBatch2 = sites.slice(5, 10).map(s => `site:${s}`).join(' OR ');
    const siteBatch3 = sites.slice(10).map(s => `site:${s}`).join(' OR ');

    queries.push(`"${info.fullName}" (${siteBatch1})`);
    queries.push(`"${info.fullName}" (${siteBatch2})`);
    queries.push(`"${info.fullName}" (${siteBatch3})`);
  }

  return queries;
}
