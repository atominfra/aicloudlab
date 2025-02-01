const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/dashboard/node';

export async function fetchOSOptions(auth:string, cloudAccountId:string, location:string) {
  try {
    const url = `${API_BASE_URL}/cloud/os?cloud_account_id=${cloudAccountId}&location=${location}`;
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

export async function fetchPlans(auth,os, osVersion,location, accountId) {
  try {
    const url = `${API_BASE_URL}/cloud/plans?os_name=${encodeURIComponent(os)}&os_version=${encodeURIComponent(osVersion)}&location=${location}&cloud_account_id=${accountId}`;
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

export async function fetchPrice(auth,os, osVersion,location, accountId, plan) {
  try {
    const url = `${API_BASE_URL}/cloud/price?os=${encodeURIComponent(os)}&os_version=${encodeURIComponent(osVersion)}&location=${location}&cloud_account_id=${accountId}&plan=${plan}`;
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
    const url = `${API_BASE_URL}/cloud/node`;
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

export async function fetchNodes(auth) {
  try {
    const url = `${API_BASE_URL}/cloud/node`;
    const response = await fetch(url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
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

export async function fetchNode(auth,nodeId) {
  try {
    const url = `${API_BASE_URL}/cloud/node/${nodeId}`;
    const response = await fetch(url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
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

