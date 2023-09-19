/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */

import { alertService } from '../../api/alertService';

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

/**
 * Return value represented in the following date format: dd-M-yyyy.
 * @param {string} value iso format string date.
 * @return {string} string date
 * @deprecated use toDate instead.
 */
export function printDate(strDate) {
  const d = new Date(strDate);
  return d.toUTCString().slice(5, -13).replaceAll(' ', '-');
}

/**
 * Return value represented in the following date format: dd-M-yyyy.
 * @param {string} value iso format string date.
 * @return {string} string date
 */
export function toDate(value) {
  const d = new Date(value);
  return d.toUTCString().slice(5, -13).replaceAll(' ', '-');
}

/**
 * Converts a number to a currency string representation.
 * @param {number | string} value value to be converted.
 * @return {string} value represented as money.
 * @deprecated use toMoney instead
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
    console.error(
      `Error in ${money.modalInputTextName}. Error details: ${error}`
    );
  }

  return val;
};

/**
 * Return value represented as currency.
 * @param {number | string} value to be represented.
 */
export function toMoney(value) {
  let val = value;

  try {
    if (typeof value === 'string') {
      val = Number(val.replaceAll('$', '').replaceAll(',', ''));
    }

    val = val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  } catch (error) {
    val = 'N/A';
    console.error(`Error details: ${error}`);
  }

  return val;
}

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

export function currencyInput(e) {
  const parts = e.target.value.split('.');
  const inputValue = parts[0];
  const decimalValue = parts[1];
  const numValue = inputValue.split(',').join('');

  if (isNaN(numValue)) {
    e.target.value = '';
    return;
  }

  let displayValue = new Intl.NumberFormat('en-EN').format(numValue);
  displayValue = inputValue !== '0' && displayValue === '0' ? '' : displayValue;

  if (!isNaN(decimalValue)) {
    displayValue = `${displayValue}.${decimalValue.trim()}`;
  }

  e.target.value = displayValue;
}

export const clientBaseUrl = 'http://127.0.0.1:5173';

export const EMPTY_INPUT_VALIDATION_MESSAGE = 'This field is required';
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const handleErrorResponse = (error) => {
  if (error && error.response) {
    if (error.response.status === 500) {
      return alertService.error('Unexpected server error.', {
        autoClose: false,
      });
    }

    const errors = Object.keys(error.response.data).map(
      (x) => error.response.data[x]
    );
    return alertService.error(errors, { autoClose: false });
  }

  // Show other type of error
  return alertService.error(error);
};
