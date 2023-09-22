import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { getOptionRequest } from '../assets/lib/helpers';

const config = getOptionRequest();

/**
 * Retrieve user token from localStorage.
 * @return {string | undefined} `token` or `undefined`
 */
const getToken = () => {
  try {
    const strToken = localStorage.getItem('token');
    const token = JSON.parse(strToken);
    return token?.access;
  } catch (error) {
    return undefined;
  }
};

/**
 * Save an user token in the localStorage.
 * @param {object} token
 */
const saveToken = (token) => {
  const strToken = JSON.stringify(token);
  localStorage.setItem('token', strToken);
};

/**
 * Remove user token from localStorage.
 */
const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Request a new token from the API.
 * @param {object} credentials an object with username and password.
 * @return a promise with a token response.
 */
const requestNewToken = async (credentials) => {
  try {
    return await axios.post('/token/', credentials, config);
  } catch (error) {
    console.log(`Error in ${requestNewToken.name}. ${error}`);
    return error;
  }
};

/**
 * Determine whether or not a token is valid by checking its expiration date.
 */
const validateToken = () => {
  let isValid;
  const strToken = getToken();

  if (!strToken) {
    isValid = false;
  } else {
    try {
      const decoded = jwt_decode(strToken);
      const currentDate = new Date();
      if (decoded.exp * 1000 < currentDate.getTime()) {
        isValid = false;
        removeToken();
      } else {
        isValid = true;
      }
    } catch (error) {
      console.error('Error trying to validate token.\n\n Details: ', error);
      isValid = false;
    }
  }

  return isValid;
};

export const tokenService = {
  getToken,
  saveToken,
  removeToken,
  requestNewToken,
  validateToken,
};
