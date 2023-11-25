// authService.js

import { getAccessToken, setAccessToken, clearTokens } from './tokenUtils';

const backendUrl = 'http://localhost:8000';  // Update with your backend URL

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch(`${backendUrl}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${response.statusText}`);
    }

    const data = await response.json();
    const newAccessToken = data.access;
    setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    clearTokens();  // Clear tokens if refresh fails
    throw error;
  }
};

export { getAccessToken };  // Make sure to export getAccessToken
