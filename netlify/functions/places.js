let fetch;

export const handler = async (event) => {
  // Dynamic import for node-fetch
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }

  const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1/places';

  try {
    const { domain, query } = JSON.parse(event.body);
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    // First search for places matching the query
    const searchResponse = await fetch(`${PLACES_API_BASE_URL}:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.websiteUri,places.rating,places.primaryTypeDisplayName'
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "en"
      })
    });

    if (!searchResponse.ok) {
      throw new Error(`Places API search failed: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.places || searchData.places.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: null })
      };
    }

    // Get the first result
    const place = searchData.places[0];
    
    // Helper function to compare domains
    const domainsMatch = (domain1, domain2) => {
      try {
        const normalize = (url) => {
          // Remove protocol and www
          let normalized = url.toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '');
          // Remove trailing slash and path
          normalized = normalized.split('/')[0];
          return normalized;
        };
        
        return normalize(domain1) === normalize(domain2);
      } catch (error) {
        console.error('Error comparing domains:', error);
        return false;
      }
    };

    // Clean business name for comparison
    const cleanBusinessName = (name) => {
      return name.toLowerCase()
        .replace(/^www\./, '')
        .replace(/\.(com|net|org|io|co|uk|us)$/, '')
        .replace(/[^a-z0-9]/g, '');
    };

    const cleanedSearchName = cleanBusinessName(domain);
    const cleanedPlaceName = cleanBusinessName(place.displayName.text);
    const websiteMatch = place.websiteUri && domainsMatch(domain, place.websiteUri);
    const nameMatch = !websiteMatch && 
                     (cleanedPlaceName.includes(cleanedSearchName) || 
                      cleanedSearchName.includes(cleanedPlaceName)) &&
                     Math.min(cleanedPlaceName.length, cleanedSearchName.length) / 
                     Math.max(cleanedPlaceName.length, cleanedSearchName.length) > 0.7;

    if (websiteMatch || nameMatch) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          result: {
            businessName: place.displayName.text,
            address: place.formattedAddress,
            rating: place.rating || 0,
            type: place.primaryTypeDisplayName || "Local Business",
            placeId: place.id,
            matchType: websiteMatch ? "website" : "name",
            websiteUrl: place.websiteUri
          }
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: null })
    };

  } catch (error) {
    console.error('Places API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
