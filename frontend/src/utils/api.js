let csrfToken = null;

export const fetchCSRFToken = async () => {
  try {
    const response = await fetch('http://localhost:3000/csrf-token', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

export const apiRequest = async (url, options = {}) => {
  try {
    // Ensure we have a CSRF token
    if (!csrfToken) {
      await fetchCSRFToken();
    }

    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      if (response.status === 403) {
        // CSRF token might be invalid, try to refresh it
        await fetchCSRFToken();
        // Retry the request with new token
        return apiRequest(url, options);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}; 