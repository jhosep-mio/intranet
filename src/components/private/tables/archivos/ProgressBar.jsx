import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div>
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;