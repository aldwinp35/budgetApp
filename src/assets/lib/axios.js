import axios from 'axios';
import tokenService from '../../api/tokenService';
import { clientBaseUrl } from './helpers';

const baseURL = clientBaseUrl;

axios.interceptors.request.use(
  // Do something before request is sent
  (config) => {
    if (config.url !== '/token/') {
      const isValid = tokenService.validateToken();
      if (isValid) {
        const token = tokenService.getToken();
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        window.location.href = `${baseURL}/login`;
      }
    }

    return config;
  },
  // Do something with request error
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  (response) => response,
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      // eslint-disable-next-line no-alert
      alert(
        "Could'nt connect with the server. Please check your internet connection or contact administrator."
      );
    }

    if (error.response?.data?.code === 'token_not_valid') {
      window.location.href = `${baseURL}/login`;
    }

    if (error.response?.status === 403) {
      window.location.href = `${baseURL}/login`;
    }

    return Promise.reject(error);
  }
);
