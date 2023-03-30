import React from 'react';
import { Doughnut } from 'react-chartjs-2';
// eslint-disable-next-line object-curly-newline
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { money } from '../../assets/lib/helpers';
import IncomeContext from '../../context/IncomeContext';

Chart.register(ArcElement, Tooltip, Legend);

function DoughnutChart() {
  const { state } = React.useContext(IncomeContext);

  function getChartData() {
    const data = [];
    const labels = [];

    state.incomeList.forEach((income) => {
      data.push(income.amount);
      labels.push(income.name);
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#6FABE6',
            '#9966FF',
            '#4BC0C0',
            '#EC85B9',
            '#3AC7A0',
            '#A687DE',
            '#36A2EB',
            '#FFCE56',
            '#9966FF',
          ],
        },
      ],
    };
  }

  const options = {
    plugins: {
      tooltip: {
        displayColors: false,
      },
    },
  };

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="section">
        <div className="text-center">
          <h4 className="fw-bold">
            {money(
              state.incomeList.reduce((sum, val) => {
                sum += val.amount;
                return sum;
              }, 0)
            )}
          </h4>
          <p className="">Total Income</p>
        </div>
        <Doughnut options={options} data={getChartData()} />
      </div>
    </div>
  );
}

export default DoughnutChart;
