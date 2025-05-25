import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import './Visualizer.css';

const ROWS = 10;
const COLS = 10;

const createEmptyGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === 0 && col === 0,
        isEnd: row === ROWS - 1 && col === COLS - 1,
        isWall: false,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

const Visualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mode, setMode] = useState('wall');

  useEffect(() => {
    setGrid(createEmptyGrid());
  }, []);

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));

    if (mode === 'wall') {
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
    } else if (mode === 'start') {
      newGrid.forEach((r) => r.forEach((c) => (c.isStart = false)));
      newGrid[row][col].isStart = true;
    } else if (mode === 'end') {
      newGrid.forEach((r) => r.forEach((c) => (c.isEnd = false)));
      newGrid[row][col].isEnd = true;
    }

    setGrid(newGrid);
  };

  return (
    <div className="visualizer">
      <div className="controls">
        <button onClick={() => setMode('wall')}>Wall</button>
        <button onClick={() => setMode('start')}>Set Start</button>
        <button onClick={() => setMode('end')}>Set End</button>
      </div>
      {grid.length > 0 && (
  <div className="grids">
    <div>
      <h3>Dijkstra</h3>
      <Grid grid={grid} onCellClick={handleCellClick} />
    </div>
    <div>
      <h3>A*</h3>
      <Grid grid={grid} onCellClick={handleCellClick} />
    </div>
  </div>
)}
    </div>
  );
};

export default Visualizer;
