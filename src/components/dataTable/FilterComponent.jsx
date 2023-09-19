import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import Context from '../../context/Context';

function FilterComponent({ onFilter, placeholder }) {
  const { state } = useContext(Context);
  return state.toggleSearch ? (
    <div className="div-input-search mt-2 mt-md-0 ms-md-2">
      <input
        id="input-search"
        value={state.filterText}
        autoFocus
        onChange={onFilter}
        type="text"
        className=""
        placeholder={placeholder}
      />
    </div>
  ) : null;
}

// FilterComponent.propTypes = {
//   filterText: PropTypes.string.isRequired,
//   onFilter: PropTypes.func.isRequired,
//   placeholder: PropTypes.string.isRequired,
//   toggleSearch: PropTypes.bool.isRequired,
// };

export default FilterComponent;
