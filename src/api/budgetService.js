/* eslint-disable comma-dangle */
import axios from 'axios';
import { getOptionRequest } from '../assets/lib/helpers';

const config = getOptionRequest();

/**
 * Get list of budgets on the selectd month and year.
 * @param {number} month a number between 1 - 12.
 * @param {number} year a four digit number, e.g: 2023
 */
const getBudgetCategories = async (month, year) => {
  try {
    return await axios.get(`/budget/?month=${month}&year=${year}`, config);
  } catch (error) {
    console.error('Cound not get budget categories. Error detail: ', error);
    return error;
  }
};

/**
 * Get the remaining balance based on the monthly income and expenses.
 * @param {number} month a number between 1 - 12.
 * @param {number} year a four digit number, e.g: 2023
 */
const getBalance = async (month, year) => {
  try {
    return await axios.get(`/balance/?month=${month}&year=${year}`, config);
  } catch (error) {
    console.error('Could not get balance. Error detail: ', error);
    return error;
  }
};

async function addBudgetCategory(budget) {
  return axios.post('/budget/', budget, config);
}

async function editBudgetCategory(budget) {
  return axios.put(`/budget/${budget.id}/update/`, budget, config);
}

async function deleteBudgetCategory(id) {
  return axios.delete(`/budget/${id}/delete/`, config);
}

async function searchBudgetCategory(name) {
  return axios.get(`/budget/?name=${name}`, config);
}

const budgetService = {
  getBudgetCategories,
  addBudgetCategory,
  editBudgetCategory,
  deleteBudgetCategory,
  searchBudgetCategory,
  getBalance,
};

export default budgetService;
