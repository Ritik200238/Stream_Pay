// Quick script to query Stream app data
const GRAPHQL_ENDPOINT = 'http://localhost:8080';
const CHAIN_ID = 'ff869722e5434effbdcb533eae9979085f0ee8283aa711a9c2501838683ff54f';
const STREAM_APP_ID = 'fc1399cef978d6d7c074bcf8c437281a2382554a89b30b93caecc890e380d4cb';

async function queryStreamApp() {
  console.log('Querying Stream app...\n');

  // First, let's see what applications are available
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          applications(chainId: "${CHAIN_ID}") {
            id
            description
          }
        }`
      })
    });

    const data = await response.json();
    console.log('Applications:', JSON.stringify(data, null, 2));

    // Now try to query the Stream app specifically
    console.log('\n\nQuerying Stream app data...\n');

    const streamQuery = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          application(chainId: "${CHAIN_ID}", applicationId: "${STREAM_APP_ID}") {
            id
            description
          }
        }`
      })
    });

    const streamData = await streamQuery.json();
    console.log('Stream App:', JSON.stringify(streamData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

queryStreamApp();
