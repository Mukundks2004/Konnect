import { GraphNode } from "./graphNode";

export class Graph {
    // private adjacencyList: Map<GraphNode, Set<[GraphNode, number]>> = new Map();
    private adjacencyList: Map<GraphNode, Map<GraphNode, number>> = new Map();

    toString(): string {
        let finalString: string = "";
        this.getNodes().forEach(node => {
            finalString += node.id + "\n";
            this.getNeighbors(node).forEach(element => {
                finalString += node.id + " " + element.id + "\n";
            });
        });

        return finalString
    } 

    addNode(node: GraphNode): void {
        if (!this.adjacencyList.has(node)) {
            this.adjacencyList.set(node, new Map());
        }
    }
  
    removeNode(node: GraphNode): void {
        if (this.adjacencyList.has(node)) {
            this.adjacencyList.delete(node);
    
            for (let key of this.adjacencyList.keys()) {
                for (let neighbor of Array.from(this.adjacencyList.get(key)?.keys() ?? [])) {
                    
                    if (neighbor === node) {
                        this.adjacencyList.get(key)?.delete(neighbor);
                        break;
                    }
                }
            }
        }
    }
  
    addEdge(node1: GraphNode, node2: GraphNode, weight: number): void {
        if (node1 === node2) {
            return;
        }
        if (!this.adjacencyList.get(node1)?.has(node2)) {
            this.addNode(node1);
            this.addNode(node2);
    
            this.adjacencyList.get(node1)?.set(node2, weight);
            this.adjacencyList.get(node2)?.set(node1, weight);
        }
    }
  
    removeEdge(node1: GraphNode, node2: GraphNode): void {
        if (this.adjacencyList.has(node1)) {
            const neighborsFrom = this.adjacencyList.get(node1)!;

            for (let neighbor of neighborsFrom.keys()) {
                if (neighbor === node2) {
                    neighborsFrom.delete(neighbor);
                    break;
                }
            }
        }

        if (this.adjacencyList.has(node2)) {
            const neighborsFrom = this.adjacencyList.get(node2)!;

            for (let neighbor of neighborsFrom.keys()) {
                if (neighbor === node1) {
                    neighborsFrom.delete(neighbor);
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

    getNeighbors(node: GraphNode): GraphNode[] {
        return Array.from(this.adjacencyList.get(node)?.keys() || []);
    }
  
    getNodes(): GraphNode[] {
        return Array.from(this.adjacencyList.keys());
    }

    getNumberOfNodes(): number {
        return this.adjacencyList.size;
    }
}