import { jwtDecode } from 'jwt-decode';

export function getLoggedInUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.username;
  } catch {
    return null;
  }
}