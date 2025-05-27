import './Node.css';

const Node = ({ isWall, isStart, isEnd, isVisited, isPath, onClick, rows, cols }) => {
  const gridSize = Math.max(rows, cols);

  let sizeClass = '';
  if (gridSize >= 10 && gridSize <= 12) {
    sizeClass = 'size-10';
  } else if (gridSize >= 13 && gridSize <= 15) {
    sizeClass = 'size-15';
  } else if (gridSize >= 16 && gridSize <= 20) {
    sizeClass = 'size-20';
  }

  let className = `node ${sizeClass}`;
  if (isStart) className += ' start';
  else if (isEnd) className += ' end';
  else if (isWall) className += ' wall';
  else if (isPath) className += ' path';
  else if (isVisited) className += ' visited';

  return <div className={className} onClick={onClick} />;
};

export default Node;
