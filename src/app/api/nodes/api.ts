const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/dashboard/node';

export async function fetchOSOptions(auth:string) {
  console.log("auth",auth)
  try {
    const url = `${API_BASE_URL}/e2e/os`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
        }
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

export async function fetchPlans(auth,os, osVersion) {
  try {
    const url = `${API_BASE_URL}/e2e/plans?os_name=${encodeURIComponent(os)}&os_version=${encodeURIComponent(osVersion)}`;
    const response = await fetch(url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      }
  });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

export async function createNode(auth , nodeData) {
  try {
    const url = `${API_BASE_URL}/e2e/node`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
      body: JSON.stringify({
        ...nodeData
      }),
  });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: }`, error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

export async function fetchNodes() {
  try {
    const url = `${API_BASE_URL}/e2e/node`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

export async function deleteNode(nodeId) {
  try {
    const url = `${API_BASE_URL}?node_id=${encodeURIComponent(nodeId)}`;
    const options = {
      method: 'DELETE',
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed:`, error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

