const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/dashboard/node';

export const createNotebook = async (auth: string, payload) => {
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
    throw new Error(errorData.message || 'Failed to fetch notebooks');
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
