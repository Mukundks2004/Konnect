import { GraphNode } from "graphNode";

export interface Edge {
    node1: GraphNode;
    node2: GraphNode;
    idealLength: number;
}