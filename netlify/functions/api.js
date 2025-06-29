exports.handler = async (event, context) => {
  const { path, httpMethod, headers, body } = event;

  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const apiPath = path.replace('/.netlify/functions/api', '');
    
    if (apiPath === '/health-check') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: 'healthy',
          service: 'Praneya Healthcare API',
          timestamp: new Date().toISOString()
        })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Praneya Healthcare API is running',
        path: apiPath,
        method: httpMethod,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      })
    };
  }
};
