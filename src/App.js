import React, { useState, useEffect } from "react";
import Grid from "./components/Grid";
import "./App.css";
import { dijkstra } from "./algorithms/dijkstra";
import { aStar } from "./algorithms/astar";

const createEmptyGrid = (rows, cols) => {
  const grid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        isVisited: false,
        isPath: false,
      });
    }
    grid.push(currentRow);
  }

  return grid;
};

function App() {
  const [grid, setGrid] = useState([]);
  const [mode, setMode] = useState(null);
  const [gridDijkstra, setGridDijkstra] = useState([]);
  const [gridAStar, setGridAStar] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState("Normal");
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);

  const speedMap = {
    Slow: 200,
    Normal: 50,
    Fast: 10,
  };

  useEffect(() => {
    const newGrid = createEmptyGrid(rows, cols);
    setGrid(newGrid);
    setGridDijkstra(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
    setGridAStar(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
  }, [rows, cols]);

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newGrid[row][col];

    if (mode === "wall") {
      if (!cell.isStart && !cell.isEnd) {
        cell.isWall = !cell.isWall;
      }
    } else if (mode === "start") {
      if (!cell.isEnd && !cell.isWall) {
        newGrid.forEach((r) => r.forEach((c) => (c.isStart = false)));
        cell.isStart = true;
      }
    } else if (mode === "end") {
      if (!cell.isStart && !cell.isWall) {
        newGrid.forEach((r) => r.forEach((c) => (c.isEnd = false)));
        cell.isEnd = true;
      }
    }

    setGrid(newGrid);
    setGridDijkstra(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
    setGridAStar(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
  };

  const handleRandomizeStartEnd = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isStart: false,
        isEnd: false,
        isVisited: false,
        isPath: false,
      }))
    );

    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);

    let endRow, endCol;
    do {
      endRow = Math.floor(Math.random() * rows);
      endCol = Math.floor(Math.random() * cols);
    } while (endRow === startRow && endCol === startCol);

    newGrid[startRow][startCol].isStart = true;
    newGrid[endRow][endCol].isEnd = true;

    setGrid(newGrid);
    setGridDijkstra(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
    setGridAStar(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
    setMetrics(null);
  };

  const handleRandomizeWalls = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isWall: false,
        isVisited: false,
        isPath: false,
      }))
    );

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = newGrid[row][col];
        if (!cell.isStart && !cell.isEnd) {
          cell.isWall = Math.random() < 0.2;
        }
      }
    }

    setGrid(newGrid);
    setGridDijkstra(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
    setGridAStar(newGrid.map((row) => row.map((cell) => ({ ...cell }))));
    setMetrics(null);
  };

  const handleResetGrid = () => {
    setIsAnimating(false);
    setMode(null);

    if (window.animationTimeouts) {
      window.animationTimeouts.forEach(clearTimeout);
      window.animationTimeouts = [];
    }

    const newGrid = createEmptyGrid(rows, cols);

    setGrid(newGrid);
    setGridDijkstra(
      newGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isVisited: false,
          isPath: false,
          isWall: false,
          isStart: false,
          isEnd: false,
        }))
      )
    );

    setGridAStar(
      newGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isVisited: false,
          isPath: false,
          isWall: false,
          isStart: false,
          isEnd: false,
        }))
      )
    );

    setMetrics(null);
  };

  const handleFindPath = () => {
    if (window.animationTimeouts) {
      window.animationTimeouts.forEach(clearTimeout);
      window.animationTimeouts = [];
    }
    setIsAnimating(true); // 🔒 Block UI actions

    const resetDijkstraGrid = gridDijkstra.map((row) =>
      row.map((cell) => ({
        ...cell,
        isVisited: false,
        isPath: false,
      }))
    );

    const resetAStarGrid = gridAStar.map((row) =>
      row.map((cell) => ({
        ...cell,
        isVisited: false,
        isPath: false,
      }))
    );

    setGridDijkstra(resetDijkstraGrid);
    setGridAStar(resetAStarGrid);

    // Wait for state update to complete before running algorithm/animation
    setTimeout(() => {
      const startNode = resetDijkstraGrid.flat().find((node) => node.isStart);
      const endNode = resetDijkstraGrid.flat().find((node) => node.isEnd);

      if (!startNode || !endNode) {
        alert("Please set start and end nodes!");
        setIsAnimating(false); // 🔓 Unlock UI if no valid start/end
        return;
      }

      const dStart = resetDijkstraGrid[startNode.row][startNode.col];
      const dEnd = resetDijkstraGrid[endNode.row][endNode.col];
      const aStart = resetAStarGrid[startNode.row][startNode.col];
      const aEnd = resetAStarGrid[endNode.row][endNode.col];

      const {
        visitedNodesInOrder: dVisited,
        shortestPathNodes: dPath,
        noPathFound,
      } = dijkstra(resetDijkstraGrid, dStart, dEnd);

      const { visitedNodesInOrder: aVisited, shortestPathNodes: aPath } = aStar(
        resetAStarGrid,
        aStart,
        aEnd
      );

      setMetrics({
        dijkstra: {
          visitCount: dVisited.length
        },
        aStar: {
          visitCount: aVisited.length,
        },
      });

      animatePathfinding(dVisited, dPath, "dijkstra");
      animatePathfinding(aVisited, aPath, "astar");

      const dijkstraTotalTime =
        speedMap[animationSpeed] * dVisited.length +
        speedMap[animationSpeed] * dPath.length;

      const aStarTotalTime =
        speedMap[animationSpeed] * aVisited.length +
        speedMap[animationSpeed] * aPath.length;

      const longestDuration = Math.max(dijkstraTotalTime, aStarTotalTime);

      setTimeout(() => {
        setIsAnimating(false);
        if (noPathFound) {
          alert("No path found!");
        }
      }, longestDuration);
    }, 0);
  };

  const animatePathfinding = (visitedNodes, shortestPath, algorithm) => {
    if (!window.animationTimeouts) window.animationTimeouts = [];

    let baseGrid =
      algorithm === "dijkstra"
        ? gridDijkstra.map((row) =>
            row.map((cell) => ({ ...cell, isPath: false }))
          )
        : gridAStar.map((row) =>
            row.map((cell) => ({ ...cell, isPath: false }))
          );

    visitedNodes.forEach((node, i) => {
      const timeoutId = setTimeout(() => {
        baseGrid[node.row][node.col].isVisited = true;

        if (algorithm === "dijkstra") {
          setGridDijkstra([...baseGrid.map((row) => [...row])]);
        } else {
          setGridAStar([...baseGrid.map((row) => [...row])]);
        }
      }, speedMap[animationSpeed] * i);

      window.animationTimeouts.push(timeoutId);
    });

    const pathTimeoutId = setTimeout(() => {
      animateShortestPath(shortestPath, algorithm);
    }, speedMap[animationSpeed] * visitedNodes.length);

    window.animationTimeouts.push(pathTimeoutId);
  };

  const animateShortestPath = (nodes, algorithm) => {
    if (!window.animationTimeouts) {
      window.animationTimeouts = [];
    }

    let animationGrid =
      algorithm === "dijkstra"
        ? gridDijkstra.map((row) =>
            row.map((cell) => ({
              ...cell,
              isPath: false,
            }))
          )
        : gridAStar.map((row) =>
            row.map((cell) => ({
              ...cell,
              isPath: false,
            }))
          );

    if (algorithm === "dijkstra") {
      setGridDijkstra(animationGrid);
    } else {
      setGridAStar(animationGrid);
    }

    for (let i = 0; i < nodes.length; i++) {
      const timeoutId = setTimeout(() => {
        const node = nodes[i];
        animationGrid[node.row][node.col].isPath = true;

        if (algorithm === "dijkstra") {
          setGridDijkstra([...animationGrid]);
        } else {
          setGridAStar([...animationGrid]);
        }
      }, speedMap[animationSpeed] * i);

      window.animationTimeouts.push(timeoutId);
    }
  };

  return (
    <div className="video-wrapper">
      <div className="extraLayer">
        <video autoPlay loop muted className="background-video">
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="app-container">
          <div className="controls">
            <h2 className="controlHeading">CONTROLS</h2>
            <label>Set:</label>
            <div className="setControls">
              <button
                onClick={() => setMode("start")}
                disabled={isAnimating}
                className={mode === "start" ? "active" : ""}
              >
                <div className="colorBox start"></div>
                Start
              </button>
              <button
                onClick={() => setMode("end")}
                disabled={isAnimating}
                className={mode === "end" ? "active" : ""}
              >
                <div className="colorBox end"></div>
                Goal
              </button>
              <button
                onClick={() => setMode("wall")}
                disabled={isAnimating}
                className={mode === "wall" ? "active" : ""}
              >
                <div className="colorBox wall"></div>
                Wall
              </button>
            </div>

            <div className="randomizer">
              <button
                onClick={() => {
                  setMode(null);
                  handleRandomizeStartEnd();
                }}
                disabled={isAnimating}
              >
                Randomize Start/End
              </button>
              <button
                onClick={() => {
                  setMode(null);
                  handleRandomizeWalls();
                }}
                disabled={isAnimating}
              >
                Randomize Walls
              </button>
            </div>
            <button
              className="findPath"
              onClick={() => {
                setMode(null);
                handleFindPath();
              }}
              disabled={isAnimating}
            >
              FIND PATH
            </button>

            <div className="speed">
              <label htmlFor="speed">Speed: </label>
              <select
                id="speed"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(e.target.value)}
                disabled={isAnimating}
              >
                <option value="Slow">Slow</option>
                <option value="Normal">Normal</option>
                <option value="Fast">Fast</option>
              </select>
            </div>

            <div className="resizeGrid">
              <label>
                Rows:
                <select
                  value={rows}
                  onChange={(e) => {
                    setRows(Number(e.target.value));
                    setMetrics(null);
                  }}
                  disabled={isAnimating}
                >
                  {Array.from({ length: 11 }, (_, i) => 10 + i).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Columns:
                <select
                  value={cols}
                  onChange={(e) => {
                    setCols(Number(e.target.value));
                    setMetrics(null);
                  }}
                  disabled={isAnimating}
                >
                  {Array.from({ length: 11 }, (_, i) => 10 + i).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button className="reset" onClick={handleResetGrid}>
              RESET
            </button>
          </div>

          <div className="grid-pair">
            <div>
              <div className="algoName">
                Dijkstra's <br /> Algorithm
              </div>
              <Grid
                grid={gridDijkstra}
                onCellClick={handleCellClick}
                metrics={!isAnimating ? metrics?.dijkstra : null}
                cols={cols}
                rows={rows}
              />
            </div>
            <div>
              <div className="algoName">
                A Star <br /> Algorithm
              </div>
              <Grid
                grid={gridAStar}
                onCellClick={handleCellClick}
                metrics={!isAnimating ? metrics?.aStar : null}
                cols={cols}
                rows={rows}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
