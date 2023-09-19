/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

import '../../assets/scss/button-circle.scss';

function ButtonCircle(props) {
  const { disabled, small, fill, children, loading, ...rest } = props;

  return (
    <div
      className={classnames(
        'btn-circle',
        { disabled: disabled },
        { 'circle-sm': small },
        { 'circle-fill': fill }
      )}
      role="button"
      {...rest}
    >
      <div className="d-flex align-items-center">
        {loading ? (
          <Spinner color="secondary" size="sm">
            Loading...
          </Spinner>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

ButtonCircle.propTypes = {
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  small: PropTypes.bool,
  children: PropTypes.element.isRequired,
  loading: PropTypes.bool,
};

ButtonCircle.defaultProps = {
  disabled: false,
  loading: false,
  fill: false,
  small: false,
};

export default ButtonCircle;
