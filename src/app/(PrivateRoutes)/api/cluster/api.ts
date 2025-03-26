export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/dashboard/node"

export async function createCluster( auth,clusterData) {
  try {
    const url = `${API_BASE_URL}/cluster/`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(clusterData),
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request Failed: `, error)
    throw new Error(error.message || "An unexpected error occurred")
  }
}

export async function fetchClusterbyId(auth: string, clusterId: number) {
  try {
    const url = `${API_BASE_URL.replace("/dashboard/node", "")}/cluster/${clusterId}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request Failed: `, error)
    throw new Error(error.message || "An unexpected error occurred")
  }
}

export async function fetchPrivateKey(auth: string, clusterId: number) {
  try {
    const url = `${API_BASE_URL}/cluster/private-key/${clusterId}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`)
    }

    return await response.blob() // Convert response to a Blob for file handling
  } catch (error) {
    console.error(`API Request Failed: `, error)
    throw new Error(error.message || "An unexpected error occurred")
  }
}

export async function fetchClustersByProject(auth: string, projectId: number) {
  try {
    const url = `${API_BASE_URL.replace("/dashboard/node", "")}/cluster/project/${projectId}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request Failed: `, error)
    throw new Error(error.message || "An unexpected error occurred")
  }
}

export async function fetchAllClusters(auth: string) {
  try {
    const url = `${API_BASE_URL}/cluster/`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request Failed: `, error)
    throw new Error(error.message || "An unexpected error occurred")
  }
}

export async function deleteCluster(auth, cluster_id:string) {
  try {
    const url = `${API_BASE_URL}/cluster/${encodeURIComponent(cluster_id)}`;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
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