import React from 'react';
import Node from './Node';
import './Grid.css';

const Grid = ({ grid, onCellClick, metrics, cols, rows }) => {
  return (
    <div>
      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((node, nodeIdx) => (
              <Node
                key={nodeIdx}
                {...node}
                onClick={() => onCellClick(node.row, node.col)}
                cols={cols} // ✅ Pass cols
                rows={rows}
              />
            ))}
          </div>
        ))}
      </div>

      {metrics && (
        <div className="metrics">
          <p>Visited Nodes:</p>
          <h2>{metrics.visitCount}</h2>
        </div>
      )}
    </div>
  );
};


export default Grid;
