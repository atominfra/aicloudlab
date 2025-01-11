const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/projects';

export const getAllProjects = async (auth: string) => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch projects');
  }
  return response.json();
};

export const createProject = async (auth: string, payload: any) => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create project');
  }
  return response.json();
};

export const getOneProject = async (auth: string, projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch project');
  }
  return response.json();
};

export const updateProject = async (auth: string, projectId: string, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update project');
  }
  return response.json();
};

export const deleteProject = async (auth: string, projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete project');
  }
  return response.json();
};
