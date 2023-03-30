import axios from 'axios';
import { getOptionRequest } from '../assets/lib/helpers';

const config = getOptionRequest();

async function editIncome(income) {
  return axios.put(`/income/${income.id}/update/`, income, config);
}

async function deleteIncome(id) {
  return axios.delete(`/income/${id}/delete/`, config);
}

const incomeService = {
  editIncome,
  deleteIncome,
};

export default incomeService;
