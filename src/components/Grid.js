import React from "react";
import Node from "./Node";
import "./Grid.css";

const Grid = ({ grid, onCellClick, metrics, cols, rows }) => {
  return (
    <div>
      <div className="grid-container">
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="row">
              {row.map((node, nodeIdx) => (
                <Node
                  key={nodeIdx}
                  {...node}
                  onClick={() => onCellClick(node.row, node.col)}
                  cols={cols}
                  rows={rows}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {metrics && (
        <div className="metrics">
          <p>Visited Nodes: {metrics.visitCount}</p>
        </div>
      )}
    </div>
  );
};

export default Grid;
