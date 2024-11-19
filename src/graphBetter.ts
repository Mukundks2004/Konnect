// type Node = {
//     value: number;
// }
// type Edge = {
//     node: Node;
//     weight: number;
// };
  
//   class Graph {
//     private adjacencyList: { [key: number]: Edge[] };
  
//     constructor() {
//       this.adjacencyList = {};
//     }
  
//     addNode(node: number): void {
//       if (!this.adjacencyList[node]) {
//         this.adjacencyList[node] = [];
//       }
//     }
  
//     removeNode(node: number): void {
//       delete this.adjacencyList[node];
//       for (let key in this.adjacencyList) {
//         this.adjacencyList[key] = this.adjacencyList[key].filter(edge => edge.node.value !== node);
//       }
//     }
  
//     // Add an edge between two nodes
//     addEdge(node1: string, node2: string, weight: number = 1): void {
//       if (!this.adjacencyList[node1]) this.addNode(node1);
//       if (!this.adjacencyList[node2]) this.addNode(node2);
  
//       const edge: Edge = this.isWeighted ? { node: node2, weight } : { node: node2 };
//       this.adjacencyList[node1].push(edge);
  
//       if (!this.isDirected) {
//         const reverseEdge: Edge = this.isWeighted ? { node: node1, weight } : { node: node1 };
//         this.adjacencyList[node2].push(reverseEdge);
//       }
//     }
  
//     // Remove an edge between two nodes
//     removeEdge(node1: string, node2: string): void {
//       if (!this.adjacencyList[node1]) return;
//       this.adjacencyList[node1] = this.adjacencyList[node1].filter(edge => edge.node !== node2);
  
//       if (!this.isDirected) {
//         this.adjacencyList[node2] = this.adjacencyList[node2].filter(edge => edge.node !== node1);
//       }
//     }
  
//     // Print the graph (for debugging or visualization)
//     printGraph(): void {
//       for (let node in this.adjacencyList) {
//         const edges = this.adjacencyList[node]
//           .map(edge => (this.isWeighted ? `${edge.node} (weight: ${edge.weight})` : edge.node))
//           .join(', ');
//         console.log(`${node} -> ${edges}`);
//       }
//     }
  
//     // Check if an edge exists between two nodes
//     hasEdge(node1: string, node2: string): boolean {
//       return this.adjacencyList[node1]?.some(edge => edge.node === node2) ?? false;
//     }
  
//     // Depth-First Search (DFS)
//     dfs(startNode: string, visited: Set<string> = new Set()): void {
//       console.log(startNode);
//       visited.add(startNode);
  
//       for (let edge of this.adjacencyList[startNode]) {
//         if (!visited.has(edge.node)) {
//           this.dfs(edge.node, visited);
//         }
//       }
//     }
  
//     // Breadth-First Search (BFS)
//     bfs(startNode: string): void {
//       const visited = new Set<string>();
//       const queue: string[] = [startNode];
//       visited.add(startNode);
  
//       while (queue.length) {
//         const node = queue.shift()!;
//         console.log(node);
  
//         for (let edge of this.adjacencyList[node]) {
//           if (!visited.has(edge.node)) {
//             visited.add(edge.node);
//             queue.push(edge.node);
//           }
//         }
//       }
//     }
  
//     // Check if the graph contains a node
//     containsNode(node: string): boolean {
//       return this.adjacencyList.hasOwnProperty(node);
//     }
  
//     // Get all nodes
//     getNodes(): string[] {
//       return Object.keys(this.adjacencyList);
//     }
  
//     // Get all edges
//     getEdges(): [string, string, number | undefined][] {
//       const edges: [string, string, number | undefined][] = [];
//       for (let node in this.adjacencyList) {
//         for (let edge of this.adjacencyList[node]) {
//           edges.push([node, edge.node, edge.weight]);
//         }
//       }
//       return edges;
//     }
//   }
  
//   // Example usage
//   const graph = new Graph(false, true);  // Undirected, Weighted graph
  
//   graph.addNode('A');
//   graph.addNode('B');
//   graph.addNode('C');
  
//   graph.addEdge('A', 'B', 10);
//   graph.addEdge('A', 'C', 5);
//   graph.addEdge('B', 'C', 2);
  
//   graph.printGraph(); // Print the graph
  
//   console.log("\nDFS starting from A:");
//   graph.dfs('A');
  
//   console.log("\nBFS starting from A:");
//   graph.bfs('A');
  