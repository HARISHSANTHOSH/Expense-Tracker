// csrfUtils.js

const getCsrfToken = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/get-csrf-token/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('CSRF Token:', data);  // Log the entire response data
      return data;  // Return the entire response data as the CSRF token
    } else {
      console.error(`Error: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
};

export default getCsrfToken;
