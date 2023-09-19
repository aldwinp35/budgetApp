import React, { useMemo, useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// import PropTypes from 'prop-types';

import { toMoney } from '../../assets/lib/helpers';
import Context from '../../context/Context';

Chart.register(ArcElement, Tooltip, Legend);

function DoughnutChart() {
  const { state } = useContext(Context);

  const getChartData = useMemo(() => {
    let amounts = [];
    let names = [];
    const colors = [
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
    ];

    state.incomeList.forEach((income) => {
      amounts = [...amounts, income.amount];
      names = [...names, income.name];
    });

    return {
      labels: names,
      datasets: [
        {
          data: amounts,
          backgroundColor: colors,
        },
      ],
    };
  }, [state.incomeList]);

  const options = useMemo(
    () => ({
      plugins: {
        tooltip: {
          displayColors: false,
        },
      },
    }),
    []
  );

  const totalIncome = useMemo(
    () =>
      state.incomeList.reduce((_sum, val) => {
        let sum = _sum;
        sum += val.amount;
        return sum;
      }, 0),
    [state.incomeList]
  );

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      {state.incomeList.length === 0 && (
        <div className="section d-flex flex-column justify-content-center align-items-center">
          <div className="text-secondary fst-italic">No chart data</div>
        </div>
      )}

      {state.incomeList.length > 0 && (
        <div className="section" style={{ minHeight: 'unset' }}>
          <div className="text-center">
            <h4 className="fw-bold">{toMoney(totalIncome)}</h4>
            <p className="">Total Income</p>
          </div>
          <Doughnut options={options} data={getChartData} />
        </div>
      )}
    </div>
  );
}

// DoughnutChart.propTypes = {
//   incomeList: PropTypes.arrayOf(Object).isRequired,
// };

export default DoughnutChart;
