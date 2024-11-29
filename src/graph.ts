import { GraphNode } from "./graphNode";
import { Edge } from "./edge";

export class Graph {
    private nodes: Map<number, GraphNode> = new Map();
    private edges: Set<string> = new Set();
    private weightedEdges: Set<Edge> = new Set();
  
    printAll(): void {
        this.getEdges().forEach(element => {
            console.log("egde", element.node1Id, element.node2Id);
        });
        this.getNodes().forEach(element => {
            console.log("node", element.id);
        });
        console.log();
        console.log();
    }

    toString(): string {
        let finalString: string = "";
        this.getNodes().forEach(node => {
            finalString += node.id + "\n";
        });
        this.getEdges().forEach(edge => {
            finalString += edge.node1Id + " " + edge.node2Id + "\n";
        });
        return finalString
    } 

    addNode(node: GraphNode): void {
        console.log("Adding node: " + node.id);
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, node);
        }
    }
  
    removeNode(nodeId: number): void {
        if (this.nodes.has(nodeId)) {
            this.nodes.delete(nodeId);
    
            this.weightedEdges.forEach((edge) => {
                if (edge.node1Id === nodeId || edge.node2Id === nodeId) {
                    this.weightedEdges.delete(edge);
                }
            });
        }
    }
  
    addEdge(node1Id: number, node2Id: number, idealLength: number): void {
        console.log("Adding edge: " + node1Id + " to " + node2Id);
        if (this.nodes.has(node1Id) && this.nodes.has(node2Id) && node1Id !== node2Id) {
            const edge: Edge = { node1Id, node2Id, idealLength };
            const sortedEdge = node1Id < node2Id ? `${node1Id}-${node2Id}` : `${node2Id}-${node1Id}`;
        
            if (!this.edges.has(sortedEdge)) {
                this.edges.add(sortedEdge);
                this.weightedEdges.add(edge);
            }
        }
    }
  
    removeEdge(node1Id: number, node2Id: number): void {
        if (this.nodes.has(node1Id) && this.nodes.has(node2Id)) {
          const sortedEdge = node1Id < node2Id ? `${node1Id}-${node2Id}` : `${node2Id}-${node1Id}`;
          
          if (this.edges.has(sortedEdge)) {
                this.edges.delete(sortedEdge);
                
                this.weightedEdges.forEach((edge) => {
                    if ((edge.node1Id === node1Id && edge.node2Id === node2Id) || (edge.node1Id === node2Id && edge.node2Id === node1Id)) {
                        this.weightedEdges.delete(edge);
                    }
                });
            }
        }
      }
  
    getNodes(): GraphNode[] {
        return Array.from(this.nodes.values());
    }
    
    getEdges(): Edge[] {
        return Array.from(this.weightedEdges);
    }

    getNodeWithId(id: number): GraphNode {
        const node: GraphNode | undefined = this.nodes.get(id);
        if (node === undefined) {
            throw "Node not found: " + id;
        }
        return node;
    }
}