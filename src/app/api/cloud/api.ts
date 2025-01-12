interface CloudAccountData{
  name: string;
  provider: string;
  credentials: {
    tenant_id: string;
    client_id: string;
    client_secret: string;
    subscription_id: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/dashboard/node';

// Fetch all cloud accounts
export async function fetchAllCloudAccounts(auth: string) {
  try {
    const url = `${API_BASE_URL}/cloud/`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
        }
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.log(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
  }
}

// Fetch a single cloud account
export async function fetchCloudAccount(auth: string, accountId: string) {
  try {
    const url = `${API_BASE_URL}/cloud/${accountId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.log(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
  }
}

// Create a new cloud account
export async function createCloudAccount(auth: string, accountData: CloudAccountData) {
  try {
    const url = `${API_BASE_URL}/cloud/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.log(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
  }
}

// Fetch nodes associated with a cloud account
export async function fetchNodesForAccount(auth: string, accountId: string) {
  try {
    const url = `${API_BASE_URL}/cloud/${accountId}/node`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.log(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
  }
}


export async function deleteCloudAccount(auth: string, accountId: string) {
  try {
    const url = `${API_BASE_URL}/cloud/${accountId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.log(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: `, error);
  }
}
