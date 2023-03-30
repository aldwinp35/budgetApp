import axios from 'axios';
import { redirect } from 'react-router-dom';
import { getOptionRequest } from '../assets/lib/helpers';
import tokenService from './tokenService';

const config = getOptionRequest();

/**
 * Log user in.
 * @param {object} credentials an object with username and password.
 * @return a boolean promise. If `true`, login was success, otherwise `false`.
 */
const login = async (credentials) => {
  const response = await tokenService.requestNewToken(credentials);
  if (response.data) {
    tokenService.saveToken(response.data);
    return true;
  }

  return false;
};

/**
 * Remove token and redirect to login page.
 */
const logout = () => {
  tokenService.removeToken();
  return redirect('/login');
};

/**
 * Not implemented yet.
 */
const register = (user) => {
  const req = axios.post('/register/', user, config);
  req.then((res) => {
    if (res.data) {
      tokenService.saveToken(res.data);
    }

    return res.data;
  });
};

const authService = {
  login,
  logout,
  register,
};

export default authService;
