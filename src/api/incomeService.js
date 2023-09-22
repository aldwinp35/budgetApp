import axios from 'axios';
import { getOptionRequest } from '../assets/lib/helpers';

const pathname = '/income';
const config = getOptionRequest();

// INCOMES
/**
 * Get all incomes.
 */
function getAll() {
  return axios.get(pathname + '/', config);
}

/**
 * Get incomes on the selectd month and year.
 * @param {number} month a number between 1 - 12.
 * @param {number} year a four digit number, e.g: 2023
 */
function getByMonthAndYear(month, year) {
  return axios.get(`${pathname}/?month=${month}&year=${year}`, config);
}

/**
 * Get incomes by date.
 * @param {string} date ISO string date (yyyy-mm-dd)
 */
function getByDate(date) {
  return axios.get(`${pathname}/?date=${date}`, config);
}

/**
 * Get incomes between two dates.
 * @param {string} startDate ISO string date (yyyy-mm-dd)
 * @param {string} endDate ISO string date (yyyy-mm-dd)
 */
function getByDateRange(startDate, endDate) {
  return axios.get(`${pathname}/?start=${startDate}&end=${endDate}`, config);
}

/**
 * Create an income.
 */
function create(params) {
  return axios.post(`${pathname}/`, params, config);
}

/**
 * Update an income.
 */
function update(id, params) {
  return axios.put(`${pathname}/${id}/update/`, params, config);
}

/**
 * Remove an income.
 */
function remove(id) {
  return axios.delete(`${pathname}/${id}/delete/`, config);
}

/**
 * Remove several an incomes.
 */
function removeBulk(ids) {
  return axios.delete(`${pathname}/delete-bulk/?ids=${ids}`, config);
}

// CATEGORIES
/**
 * Get all income categories.
 */
function getCategories() {
  return axios.get(`${pathname}-category/`, config);
}

/**
 * Create an income category.
 */
function createCategory(params) {
  return axios.post(`${pathname}-category/`, params, config);
}

/**
 * Update an income category.
 */
function updateCategory(id, params) {
  return axios.put(`${pathname}-category/${id}/`, params, config);
}

/**
 * Remove an income category.
 */
function removeCategory(id) {
  return axios.delete(`${pathname}-category/${id}/`, config);
}

function getIncomeDates() {
  return axios.get('data-dates/?type=income', config);
}

export const incomeService = {
  // incomes
  getAll,
  getByMonthAndYear,
  getByDate,
  getByDateRange,
  create,
  update,
  remove,
  removeBulk,
  // categories
  getCategories,
  createCategory,
  updateCategory,
  removeCategory,
  // other
  getIncomeDates,
};
