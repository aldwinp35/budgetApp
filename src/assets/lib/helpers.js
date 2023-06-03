/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */

/**
 * Get a lite random color.
 * @return a hexadecimal color.
 */
export const getRandomColor = () => {
  // Save color in localStorage
  if (!localStorage.getItem('colors')) {
    localStorage.setItem('colors', [
      '#EC85B9',
      '#3AC7A0',
      '#A687DE',
      '#6FABE6',
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#9966FF',
    ]);
  }

  // Get ramdon color
  let colors = localStorage.getItem('colors').split(',');
  const index = Math.floor(Math.random() * colors.length);
  const selected = colors[index];

  // Remove color
  colors = colors.filter((color) => color !== selected);
  localStorage.removeItem('colors');
  localStorage.setItem('colors', colors);

  return selected;
};

export function printDate(strDate) {
  const d = new Date(strDate);
  return d.toUTCString().slice(5, -13).replaceAll(' ', '-');
}

/**
 * Converts a number to a currency string representation.
 * @param {number | string} value value to be converted.
 * @return {string} value represented as money.
 */
export const money = (value) => {
  let val = value;

  try {
    val = typeof val === 'string' ? Number(val) : val;
    val = val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  } catch (error) {
    console.error(`Error in ${money.modalInputTextName}. Error details: ${error}`);
  }

  return val;
};

/**
 * Get configuration for http requests.
 * @return {object} an object with headers, baseURL, etc...
 */
export const getOptionRequest = () => {
  return {
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const clientBaseUrl = 'http://127.0.0.1:5173';
