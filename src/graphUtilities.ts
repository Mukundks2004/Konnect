import { Graph } from "graph";
import { GraphNode } from "graphNode";

export function isGraphConnected(graph: Graph): boolean {
    if (graph.getNumberOfNodes() === 1) {
        return true;
    }
    let result: boolean = true;
    graph.getNodes().forEach(node => {
        if (graph.getNeighbors(node).length == 0) {
            result = false;
            return;
        }
    });
    return result;
}

export function isGraphComplete(graph: Graph): boolean {
    const size = graph.getNumberOfNodes();
    let result: boolean = true;
    graph.getNodes().forEach(node => {
        if (graph.getNeighbors(node).length !== size - 1) {
            result = false;
        }
    });
    return result;
}

export function nodeCount(graph: Graph): number {
    return graph.getNumberOfNodes();
}

export function edgeCount(graph: Graph): number {
    let count = 0;
    graph.getNodes().forEach((node) => {
        count += graph.getNeighbors(node).length;
    })

    return count / 2;
}

export function findShortestCycle(graph: Graph): number {
    let minCycleLength = Infinity;

    const bfs = (start: GraphNode): number => {
        const queue: [GraphNode, GraphNode | null, number][] = [[start, null, 0]];
        const visited = new Map<GraphNode, boolean>();
        const distance = new Map<GraphNode, number>();
        const parent = new Map<GraphNode, GraphNode | null>();

        visited.set(start, true);
        distance.set(start, 0);
        parent.set(start, null);

        while (queue.length > 0) {
            const [currentNode, currentParent, currentDist] = queue.shift()!;
            for (let neighbor of graph.getNeighbors(currentNode!)) {
                if (!visited.has(neighbor)) {
                    visited.set(neighbor, true);
                    distance.set(neighbor, currentDist + 1);
                    parent.set(neighbor, currentNode);
                    queue.push([neighbor, currentNode, currentDist + 1]);
                } else if (neighbor !== currentParent) {
                    const cycleLength = currentDist + 1 + distance.get(neighbor)!;
                    minCycleLength = Math.min(minCycleLength, cycleLength);
                }
            }
        }
        return minCycleLength;
    };

    for (let node of graph.getNodes()) {
        minCycleLength = bfs(node);
    }

    return minCycleLength === Infinity ? -1 : minCycleLength;
}