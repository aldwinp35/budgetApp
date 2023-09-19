import axios from 'axios';
import { getOptionRequest } from '../assets/lib/helpers';

const pathname = '/budget';
const config = getOptionRequest();

/**
 * Get all budget categories.
 */
function getAll() {
  return axios.get(pathname + '/', config);
}

/**
 * Get budget categories on the selectd month and year.
 * @param {number} month a number between 1 - 12.
 * @param {number} year a four digit number, e.g: 2023
 */
function getByMonthAndYear(month, year) {
  return axios.get(`${pathname}/?month=${month}&year=${year}`, config);
}

/**
 * Create a budget category.
 */
function create(params) {
  return axios.post(`${pathname}/`, params, config);
}

/**
 * Update a budget category.
 */
function update(id, params) {
  return axios.put(`${pathname}/${id}/update/`, params, config);
}

/**
 * Remove a budget category.
 */
function remove(id) {
  return axios.delete(`${pathname}/${id}/delete/`, config);
}

/**
 * Search budget categories by name.
 */
function searchByName(name) {
  return axios.get(`${pathname}/?name=${name}`, config);
}

/**
 * Get the remaining balance based on the monthly income and expenses.
 * @param {number} month a number between 1 - 12.
 * @param {number} year a four digit number, e.g: 2023
 */
function getBalance(month, year) {
  return axios.get(`/balance/?month=${month}&year=${year}`, config);
}

/**
 * Get the dates where the data is present.
 */
// getBudgetDates()
// getIncomeDates()
// /api/data-dates/
// /api/data-date/type=income (green)
// /api/data-date/type=budget (orange)
// /api/data-date/type=expense (red)
function getBudgetDates() {
  return axios.get(`dates-with-data?type=budget`, config);
}

/**
 * Get all budget items.
 */
function getAllItem() {
  return axios.get(`${pathname}-item/`, config);
}

/**
 * Get budget items by id.
 */
function getItemByBudgetId(id) {
  return axios.get(`${pathname}/${id}/items/`, config);
}

/**
 * Create budget item.
 */
function createItem(params) {
  return axios.post(`${pathname}-item/`, params, config);
}

/**
 * Update budget item.
 */
function updateItem(id, params) {
  return axios.put(`${pathname}-item/${id}/`, params, config);
}

/**
 * Remove budget item.
 */
function removeItem(id) {
  return axios.delete(`${pathname}-item/${id}/`, config);
}

/**
 * Get all budget's item categories.
 */
function getAllItemCategory() {
  return axios.get('item-category/', config);
}

/**
 * Get all budget's item categories.
 */
function getItemCategoryByBudgetId(id) {
  return axios.get(`${pathname}/${id}/item-category/`, config);
}

/**
 * Create budget's item category.
 */
function createItemCategory(params) {
  return axios.post('item-category/', params, config);
}

/**
 * Update budget's item category.
 */
function updateItemCategory(id, params) {
  return axios.put(`item-category/${id}/`, params, config);
}

/**
 * Remove budget's item category.
 */
function removeItemCategory(id) {
  return axios.delete(`item-category/${id}/`, config);
}

export const budgetService = {
  // Budget Categories
  getAll,
  getByMonthAndYear,
  create,
  update,
  remove,
  // Budget Items
  getAllItem,
  getItemByBudgetId,
  createItem,
  updateItem,
  removeItem,
  // Item Categories
  getAllItemCategory,
  getItemCategoryByBudgetId,
  createItemCategory,
  updateItemCategory,
  removeItemCategory,
  // Other
  getBudgetDates,
  searchByName,
  getBalance,
};
