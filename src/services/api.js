const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000';

export async function checkBackendHealth() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/health`
    );

    if (!response.ok) {
      return {
        connected: false,
        data: null,
      };
    }

    const data = await response.json();

    return {
      connected: true,
      data,
    };
  } catch (error) {
    return {
      connected: false,
      data: null,
    };
  }
}


export async function analyzeImage(file) {
  if (!file) {
    throw new Error('No image selected.');
  }

  const formData = new FormData();

  formData.append('image', file);

  const response = await fetch(
    `${API_BASE_URL}/api/screen`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || 'Unable to analyze image.'
    );
  }

  return data;
}