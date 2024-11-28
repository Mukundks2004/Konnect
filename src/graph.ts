import { GraphNode } from "./graphNode";
import { Edge } from "./edge";

export class Graph {
    private nodes: Map<number, GraphNode> = new Map();
    private edges: Set<string> = new Set();
    private weightedEdges: Set<Edge> = new Set();
  
    addNode(node: GraphNode): void {
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
}