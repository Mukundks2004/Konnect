import { GraphNode } from "./graphNode";

//Optimise this entire thing, have just the edges and the adjacency list
export class Graph {
    private adjacencyList: Map<GraphNode, Set<[GraphNode, number]>> = new Map();

    toString(): string {
        let finalString: string = "";
        this.getNodes().forEach(node => {
            finalString += node.id + "\n";
            this.getNeighbors(node).forEach(element => {
                finalString += node.id + " " + element[0].id + "\n";
            });
        });

        return finalString
    } 

    addNode(node: GraphNode): void {
        console.log("Adding node: " + node.id);
        if (!this.adjacencyList.has(node)) {
            this.adjacencyList.set(node, new Set());
        }
    }
  
    removeNode(node: GraphNode): void {
        if (this.adjacencyList.has(node)) {
            this.adjacencyList.delete(node);
    
            for (let [key, neighbors] of this.adjacencyList) {
                for (let neighbor of neighbors) {
                    const [neighborNode, weight] = neighbor;
                    
                    if (neighborNode === node) {
                        console.log("Deleting edge between: " + key.id + " and " + node.id);
                        neighbors.delete(neighbor);
                        break;
                    }
                }
            }
        }
    }
  
    addEdge(node1: GraphNode, node2: GraphNode, idealLength: number): void {
        console.log("Adding edge: " + node1.id + " to " + node2.id);
        this.addNode(node1);
        this.addNode(node2);

        this.adjacencyList.get(node1)?.add([node2, idealLength]);
        this.adjacencyList.get(node2)?.add([node1, idealLength]);
    }
  
    removeEdge(node1: GraphNode, node2: GraphNode): void {
        if (this.adjacencyList.has(node1)) {
            const neighborsFrom = this.adjacencyList.get(node1)!;

            for (let neighbor of neighborsFrom) {
                const [neighborNode, weight] = neighbor;
                if (neighborNode === node2) {
                    neighborsFrom.delete(neighbor);
                    break;
                }
            }
        }

        if (this.adjacencyList.has(node2)) {
            const neighborsTo = this.adjacencyList.get(node2)!;

            for (let neighbor of neighborsTo) {
                const [neighborNode, weight] = neighbor;
                if (neighborNode === node1) {
                    neighborsTo.delete(neighbor);
                    break;
                }
            }
        }
    }

    hasEdge(node1: GraphNode, node2: GraphNode): boolean {
        const edges = this.adjacencyList.get(node1);
        if (edges) {
            for (let [neighbor, _] of edges) {
                if (neighbor === node2) {
                    return true;
                }
            }
            }
        return false;
      }

    getNeighbors(node: GraphNode): [GraphNode, number][] {
        return Array.from(this.adjacencyList.get(node) || []);
    }
  
    getNodes(): GraphNode[] {
        return Array.from(this.adjacencyList.keys());
    }

    getNumberOfNodes(): number {
        return this.adjacencyList.size;
    }
}