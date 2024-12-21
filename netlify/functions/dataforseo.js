const handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { domain } = JSON.parse(event.body);
    if (!domain) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Domain is required' })
      };
    }

    // Hardcoded credentials for testing
    const login = 'moneyfarm@gmail.com';
    const password = 'f0857984f7921cba';
    const auth = Buffer.from(`${login}:${password}`).toString('base64');
    
    const response = await fetch('https://api.dataforseo.com/v3/domain_analytics/whois/overview/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": "string",
        "tasks": [{
          "target": domain,
          "location_name": "United States"
        }]
      })
    });

    console.log('DataForSEO response status:', response.status);
    const data = await response.json();
    console.log('DataForSEO response:', {
      status_code: data.status_code,
      status_message: data.status_message
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};

module.exports = { handler };
