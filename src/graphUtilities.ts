import { Graph } from "graph";
import { GraphNode } from "graphNode";

export function isGraphConnected(graph: Graph) {
    graph.getNodes().forEach(node => {
        if (graph.getNeighbors(node).length == 0) {
            return false;
        }
        return true;
    });
}

export function isGraphComplete(graph: Graph) {
    const size = graph.getNumberOfNodes();
    graph.getNodes().forEach(node => {
        if (graph.getNeighbors(node).length !== size - 1) {
            return false;
        }
        return true;
    });
}

// This is untested!
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
                if (!visited.has(neighbor[0])) {
                    visited.set(neighbor[0], true);
                    distance.set(neighbor[0], currentDist + 1);
                    parent.set(neighbor[0], currentNode);
                    queue.push([neighbor[0], currentNode, currentDist + 1]);
                } else if (neighbor[0] !== currentParent) {
                    const cycleLength = currentDist + 1 + distance.get(neighbor[0])!;
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