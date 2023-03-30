import PropTypes from 'prop-types';

const BudgetType = PropTypes.shape({
  budget: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        planned: PropTypes.number,
        spent: PropTypes.number,
        difference: PropTypes.number,
        date: PropTypes.string,
        category: PropTypes.number,
        item: PropTypes.number,
        created_by: PropTypes.number,
        // eslint-disable-next-line comma-dangle
      })
    ),
  }).isRequired,
});

export default BudgetType;
