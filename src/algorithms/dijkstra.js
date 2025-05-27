// src/algorithms/dijkstra.js

export function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);

  startNode.distance = 0;

  while (!!unvisitedNodes.length) {
    // Sort by distance
    unvisitedNodes.sort((a, b) => a.distance - b.distance);

    const closestNode = unvisitedNodes.shift();

    // If wall, skip
    if (closestNode.isWall) continue;

    // If distance is Infinity, we are trapped
    // if (closestNode.distance === Infinity) return { visitedNodesInOrder, shortestPathNodes: [] };
    if (closestNode.distance === Infinity) {
      return { visitedNodesInOrder, shortestPathNodes: [], noPathFound: true };
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === endNode) {
      // Reached end, build path
      const shortestPathNodes = getNodesInShortestPathOrder(endNode);
      return { visitedNodesInOrder, shortestPathNodes };
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }

  // No path found
  return { visitedNodesInOrder, shortestPathNodes: [] };
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      // Initialize distance and previous node
      node.distance = Infinity;
      node.previousNode = null;
      node.isVisited = false;
      nodes.push(node);
    }
  }
  return nodes;
}

function updateUnvisitedNeighbors(node, grid) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(n => !n.isVisited && !n.isWall);
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
