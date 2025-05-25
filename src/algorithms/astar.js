// src/algorithms/astar.js

export function aStar(grid, startNode, endNode) {
  const openSet = [];
  const closedSet = new Set();
  const visitedNodesInOrder = [];

  startNode.g = 0;
  startNode.h = heuristic(startNode, endNode);
  startNode.f = startNode.g + startNode.h;
  startNode.previousNode = null;

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Sort by f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (current.isWall) continue;

    visitedNodesInOrder.push(current);

    if (current === endNode) {
      const shortestPathNodes = getNodesInShortestPathOrder(endNode);
      return { visitedNodesInOrder, shortestPathNodes };
    }

    closedSet.add(current);

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor) || neighbor.isWall) continue;

      const tentativeG = current.g + 1;

      if (!openSet.includes(neighbor) || tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previousNode = current;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visitedNodesInOrder, shortestPathNodes: [] };
}

function heuristic(nodeA, nodeB) {
  // Manhattan distance
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

function getNodesInShortestPathOrder(endNode) {
  const nodesInPath = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    nodesInPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInPath;
}
