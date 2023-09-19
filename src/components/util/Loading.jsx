import React from 'react';
import { Spinner } from 'reactstrap';

function Loading(props) {
  return (
    <div className="d-flex justify-content-center my-3">
      <Spinner {...props}></Spinner>
    </div>
  );
}

export default Loading;
