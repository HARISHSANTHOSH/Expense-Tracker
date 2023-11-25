// auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
    return !!token; // Return true if the token exists
  };
export default isAuthenticated  