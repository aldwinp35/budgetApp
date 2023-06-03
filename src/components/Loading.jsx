import React from 'react';

function Loading() {
  return (
    <div className="d-flex justify-content-center my-3">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
