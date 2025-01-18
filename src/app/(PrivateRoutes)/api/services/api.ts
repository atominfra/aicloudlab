const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/dashboard/node';

export const createService = async (auth: string, payload) => {
  const response = await fetch(`${API_BASE_URL}/notebook/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create service');
  }
  return response.json();
};

export const fetchNotebooksAPI = async (auth: string) => {
  const response = await fetch(`${API_BASE_URL}/notebook`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch notebooks');
  }
  return response.json();
};

export const handleOperationRequestAPI = async (auth: string, notebookId: string, operationName: string) => {
  const response = await fetch(`${API_BASE_URL}/notebook/operation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
    body: JSON.stringify({
      notebook_id: notebookId,
      operation_name: operationName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Operation failed');
  }

  return response.json();
};

export const getAllProjectServices = async (auth: string, projectId: string) => {
  try {
    const url = `${API_BASE_URL}/service/v2/?project_id=${projectId}`;
    const response = await fetch(url, {
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
};

export const getAllNodeServices = async (auth: string, nodeId: string) => {
  try {
    const url = `${API_BASE_URL}/service/v2/?node_id=${nodeId}`;
    const response = await fetch(url, {
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
};

export const getServiceDomains = async (auth: string, serviceId: string) => {
  const response = await fetch(`${API_BASE_URL}/service/v2/${serviceId}/domain`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch service domains');
  }
  return response.json();
};

export const addDomainToService = async (auth: string, serviceId: string, domain: string) => {
  const response = await fetch(`${API_BASE_URL}/service/v2/${serviceId}/domain?domain=${encodeURIComponent(domain)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add domain to service');
  }
  return response.json();
};

export const verifyDomain = async (auth: string, domainId: number) => {
  const response = await fetch(`${API_BASE_URL}/service/v2/${domainId}/verify`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add domain to service');
  }
  return response.json();
};

export const deleteDomain = async (auth: string,serviceId: string, domainId: number) => {
  const response = await fetch(`${API_BASE_URL}/service/v2/${serviceId}/domain/${domainId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete domain');
  }
  return response.json();
};

export const deleteService = async (auth: string, serviceId: string) => {
  const response = await fetch(`${API_BASE_URL}/service/v2/${serviceId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add domain to service');
  }
  return response.json();
};

export const changeServiceStatus = async (auth: string, serviceId: string, action:string) => {
  const response = await fetch(`${API_BASE_URL}/service/v2/${serviceId}/${action}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add domain to service');
  }
  return response.json();
};