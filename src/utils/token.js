import jwtDecode from 'jwt-decode';
import { TOKEN } from './constants';

export const setToken = (token) => {
    localStorage.setItem(TOKEN, token);
}

export const getToken = () => localStorage.getItem(TOKEN);

export const decodeToken = (token) => jwtDecode(token);