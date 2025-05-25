import React from 'react';
import './Node.css';

const Node = ({ isWall, isStart, isEnd, isVisited, isPath, onClick, rows, cols }) => {
  const gridSize = Math.max(rows, cols); // Choose the more restrictive dimension
  let className = `node size-${gridSize}`;
  if (isStart) className += ' start';
  else if (isEnd) className += ' end';
  else if (isWall) className += ' wall';
  else if (isPath) className += ' path';
  else if (isVisited) className += ' visited';

  return <div className={className} onClick={onClick} />;
};


export default Node;
