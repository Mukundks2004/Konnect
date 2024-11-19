To create a **versatile graph class** in JavaScript, we should build one that can handle **different types of graphs** (directed, undirected, weighted, unweighted) and provide functionality for **common graph operations** (like adding nodes, adding edges, printing the graph, and traversing). Additionally, it should be simple to extend for more advanced graph algorithms (like BFS, DFS, Dijkstra, etc.).

Here’s a **versatile graph class** design that will work well for **most use cases**. The class will use an **adjacency list representation**, but with flexibility to handle weighted, directed, and undirected graphs.

### Features of the Graph Class:
1. **Directed/Undirected**: The graph should support both directed and undirected graphs.
2. **Weighted/Unweighted**: It should support both weighted and unweighted edges.
3. **Basic Operations**: It should allow adding nodes, adding edges, removing nodes, removing edges, printing the graph, and checking if an edge exists.
4. **Traversal Methods**: Implement basic traversals like **BFS** and **DFS**.
5. **Dynamic Graph**: You can add/remove nodes/edges dynamically.

Here’s a **versatile graph class**:

```javascript
class Graph {
  constructor(isDirected = false, isWeighted = false) {
    this.isDirected = isDirected;  // Whether the graph is directed
    this.isWeighted = isWeighted;  // Whether the graph is weighted
    this.adjacencyList = {};       // Adjacency list to store the graph
  }

  // Add a node to the graph
  addNode(node) {
    if (!this.adjacencyList[node]) {
      this.adjacencyList[node] = [];
    }
  }

  // Remove a node from the graph
  removeNode(node) {
    delete this.adjacencyList[node];
    // Also remove edges connected to the node
    for (let key in this.adjacencyList) {
      this.adjacencyList[key] = this.adjacencyList[key].filter(edge => edge.node !== node);
    }
  }

  // Add an edge between two nodes
  addEdge(node1, node2, weight = 1) {
    if (!this.adjacencyList[node1]) this.addNode(node1);
    if (!this.adjacencyList[node2]) this.addNode(node2);

    // For weighted graphs, store weight in edge object
    const edge = this.isWeighted ? { node: node2, weight } : { node: node2 };

    this.adjacencyList[node1].push(edge);

    // If the graph is undirected, also add the reverse edge
    if (!this.isDirected) {
      const reverseEdge = this.isWeighted ? { node: node1, weight } : { node: node1 };
      this.adjacencyList[node2].push(reverseEdge);
    }
  }

  // Remove an edge between two nodes
  removeEdge(node1, node2) {
    if (!this.adjacencyList[node1]) return;
    this.adjacencyList[node1] = this.adjacencyList[node1].filter(edge => edge.node !== node2);

    if (!this.isDirected) {
      this.adjacencyList[node2] = this.adjacencyList[node2].filter(edge => edge.node !== node1);
    }
  }

  // Print the graph (for debugging or visualization)
  printGraph() {
    for (let node in this.adjacencyList) {
      const edges = this.adjacencyList[node].map(edge =>
        this.isWeighted ? `${edge.node} (weight: ${edge.weight})` : edge.node
      ).join(', ');
      console.log(`${node} -> ${edges}`);
    }
  }

  // Check if an edge exists between two nodes
  hasEdge(node1, node2) {
    return this.adjacencyList[node1]?.some(edge => edge.node === node2) || false;
  }

  // Depth-First Search (DFS)
  dfs(startNode, visited = new Set()) {
    console.log(startNode);
    visited.add(startNode);

    for (let edge of this.adjacencyList[startNode]) {
      if (!visited.has(edge.node)) {
        this.dfs(edge.node, visited);
      }
    }
  }

  // Breadth-First Search (BFS)
  bfs(startNode) {
    const visited = new Set();
    const queue = [startNode];
    visited.add(startNode);

    while (queue.length) {
      const node = queue.shift();
      console.log(node);

      for (let edge of this.adjacencyList[node]) {
        if (!visited.has(edge.node)) {
          visited.add(edge.node);
          queue.push(edge.node);
        }
      }
    }
  }

  // Check if the graph contains a node
  containsNode(node) {
    return this.adjacencyList.hasOwnProperty(node);
  }

  // Get all nodes
  getNodes() {
    return Object.keys(this.adjacencyList);
  }

  // Get all edges
  getEdges() {
    const edges = [];
    for (let node in this.adjacencyList) {
      for (let edge of this.adjacencyList[node]) {
        edges.push([node, edge.node, edge.weight]);
      }
    }
    return edges;
  }
}

// Example usage
const graph = new Graph(false, true);  // Undirected, Weighted graph

graph.addNode('A');
graph.addNode('B');
graph.addNode('C');

graph.addEdge('A', 'B', 10);
graph.addEdge('A', 'C', 5);
graph.addEdge('B', 'C', 2);

graph.printGraph(); // Print the graph

console.log("\nDFS starting from A:");
graph.dfs('A');

console.log("\nBFS starting from A:");
graph.bfs('A');
```

### Explanation of the Class

1. **Constructor**:
   - `isDirected`: Determines whether the graph is directed or undirected.
   - `isWeighted`: Determines whether the graph is weighted.
   - `adjacencyList`: Stores the graph as an adjacency list, where each node points to an array of its neighboring nodes (with weights if applicable).

2. **addNode(node)**: Adds a node to the graph (if it doesn't already exist).

3. **removeNode(node)**: Removes a node and all edges connected to it.

4. **addEdge(node1, node2, weight)**: Adds an edge between two nodes. If the graph is undirected, the edge is added in both directions. If the graph is weighted, the weight is stored.

5. **removeEdge(node1, node2)**: Removes the edge between two nodes.

6. **printGraph()**: Prints out the graph in a readable format. If the graph is weighted, it also prints the weights.

7. **hasEdge(node1, node2)**: Checks if there is an edge between two nodes.

8. **dfs(startNode, visited)**: Performs a **Depth-First Search** starting from a given node, printing nodes as it visits them. Uses recursion.

9. **bfs(startNode)**: Performs a **Breadth-First Search** starting from a given node, printing nodes as it visits them.

10. **containsNode(node)**: Checks if a node exists in the graph.

11. **getNodes()**: Returns a list of all nodes in the graph.

12. **getEdges()**: Returns a list of all edges in the graph. For weighted graphs, it includes the weights.

### Example Output:

```plaintext
A -> B (weight: 10), C (weight: 5)
B -> A (weight: 10), C (weight: 2)
C -> A (weight: 5), B (weight: 2)

DFS starting from A:
A
B
C

BFS starting from A:
A
B
C
```

### Why This Class is Versatile:
- **Directed/Undirected**: You can toggle whether the graph is directed or undirected via the constructor (`new Graph(true)` for directed).
- **Weighted/Unweighted**: The class can handle both weighted and unweighted edges.
- **Graph Traversal**: Both **DFS** and **BFS** are implemented.
- **Basic Graph Operations**: Adding/removing nodes and edges, and checking for the existence of edges or nodes.
- **Extendable**: The structure is easy to extend. For example, you could easily implement Dijkstra’s shortest path algorithm, Prim’s MST, or other graph algorithms.

This class should work well for most general-purpose graph algorithms and be flexible enough for future extensions. It strikes a good balance between simplicity and functionality. Would you like me to add any specific graph algorithms to this class?