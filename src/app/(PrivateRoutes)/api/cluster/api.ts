export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/dashboard/node"

export async function createCluster(
  auth: string,
  clusterData: {
    name: string
    image_url: string
    mem_limit: string
    cpu_limit: string
    replicas: number
    env_variables: Record<string, string>
    cluster_id: number
    registry_credential_id: number
    target_port: number
  },
) {
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

export async function fetchCluster(auth: string, clusterId: number) {
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
    const url = `${API_BASE_URL.replace("/dashboard/node", "")}/cluster`
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

