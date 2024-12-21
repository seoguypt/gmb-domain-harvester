const fetch = require('node-fetch');

const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1/places';

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

exports.handler = async (event) => {
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
        languageCode: "en",
        maxResultCount: 10 // Get more results to find better matches
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

    // Try to find the best match from all results
    const place = searchData.places.find(p => {
      // First try to find an exact website match
      if (p.websiteUri && domainsMatch(domain, p.websiteUri)) {
        return true;
      }

      // Then try to find a good name match
      const cleanedPlaceName = cleanBusinessName(p.displayName.text);
      const cleanedSearchName = cleanBusinessName(domain);
      const similarity = Math.min(cleanedPlaceName.length, cleanedSearchName.length) / 
                        Math.max(cleanedPlaceName.length, cleanedSearchName.length);
      
      return (cleanedPlaceName.includes(cleanedSearchName) || 
              cleanedSearchName.includes(cleanedPlaceName)) &&
             similarity > 0.7;
    });

    // If no good match found, return null
    if (!place) {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: null })
      };
    }

    // Determine match type
    const websiteMatch = place.websiteUri && domainsMatch(domain, place.websiteUri);
    const matchType = websiteMatch ? "website" : "name";

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: {
          businessName: place.displayName.text,
          address: place.formattedAddress,
          rating: place.rating || 0,
          type: place.primaryTypeDisplayName || "Local Business",
          placeId: place.id,
          matchType,
          websiteUrl: place.websiteUri
        }
      })
    };

  } catch (error) {
    console.error('Places API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
