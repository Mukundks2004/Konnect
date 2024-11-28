import { Vector } from "p5";
import { Graph } from "./graph";
import { GraphNode } from "./graphNode";

const NODE_COUNT: number = 30;
const CONNECTION_COUNT: number = 30;
const GRAVITY_CONST: number = 1.3;
const FORCE_CONSTANT: number = 800;
const DO_NODE_MOVEMENT: boolean = true;
const SKETCH_HEIGHT: number = 490;
const SKETCH_WIDTH: number = 550;

const DEFAULT_NODE_SIZE: number = 3;
const LINE_THICKNESS: number = 2;

const BG_COLOUR: string = '#FFCEAE';
const NODE_BORDER_COLOUR: string = '#C65102';
const NODE_COLOUR: string = '#FFA500';

const MIN_CON_LEN: number = 200;
const MAX_CON_LEN: number = 400;

const DRAG_MODE = "Drag";
const DRAW_MODE = "Draw";
const DELETE_MODE = "Delete";

export function createSketch(containerId: HTMLElement) {
    const sketch = (s: typeof p5) => {

        // Initialize graph
        const graph: Graph = new Graph();

        let clicked: boolean = false;
        let selectedNode: GraphNode | null = null;
        let selectedNodeNumber: number = -1;
        let nodeCreatedDuringThisClick: boolean = false;

        s.setup = () => {
            // Create canvas
            s.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);

            // Fill board with some nodes
            for (let i: number = 0; i < NODE_COUNT; i++) {
                const x: Vector = s.random(-SKETCH_WIDTH / 4, SKETCH_WIDTH / 4);
                const y: Vector = s.random(-SKETCH_HEIGHT / 4, SKETCH_HEIGHT / 4);
                const node: GraphNode = new GraphNode(s.createVector(x, y), DEFAULT_NODE_SIZE);
                graph.addNode(node);
            }

            // Generate sample connections
            for (let n: number = 0; n < CONNECTION_COUNT; n++) {
                graph.addEdge(
                    Math.round(s.random(NODE_COUNT - 1)),
                    Math.round(s.random(NODE_COUNT - 1)),
                    s.random(MIN_CON_LEN, MAX_CON_LEN))
            }

            // Set stroke weight
            s.strokeWeight(LINE_THICKNESS);
        };

        s.draw = () => {
            // Translate so we can draw at origin
            s.translate(SKETCH_WIDTH / 2, SKETCH_HEIGHT / 2);

            // Colour background light orange and set stroke orange
            s.background(BG_COLOUR);
            s.stroke(NODE_BORDER_COLOUR);

            const allNodes: GraphNode[] = graph.getNodes();
            // Draw all connections
            graph.getEdges().forEach(edge => {
                const node1: GraphNode = allNodes[edge.node1Id];
                const node2: GraphNode = allNodes[edge.node2Id];
                s.line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
            })

            // Drag selected node
            if (clicked) {
                if (selectedNode) {
                    switch (globalThis.state) {
                        case DRAW_MODE:
                            if (!nodeCreatedDuringThisClick) {
                                s.line(selectedNode.pos.x, selectedNode.pos.y, s.mouseX - SKETCH_WIDTH / 2, s.mouseY - SKETCH_HEIGHT / 2);
                                break;
                            }
                        case DRAG_MODE:
                        default:
                            selectedNode.pos.x = s.mouseX - SKETCH_WIDTH / 2;
                            selectedNode.pos.y = s.mouseY - SKETCH_HEIGHT / 2;
                    }
                }
            }

            // Move all nodes
            adjustForceForNodes(allNodes);

            // Draw all nodes
            s.fill(NODE_COLOUR);
            graph.getNodes().forEach(node => {
                node.draw(s);
                if (DO_NODE_MOVEMENT) {
                    node.update();
                }
            });
        };

        s.mousePressed = () => {
            if (s.mouseX > 0 && s.mouseX < SKETCH_WIDTH && s.mouseY > 0 && s.mouseY < SKETCH_HEIGHT) {
                clicked = true;
                switch (globalThis.state) {
                    case DELETE_MODE:
                    case DRAW_MODE:
                    case DRAG_MODE:
                    default:
                        let createNewNode: boolean = true;
                        const mousePos: Vector = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);
        
                        // Select node we are hovering over
                        graph.getNodes().forEach((node, index) => {
                            if (s.dist(mousePos.x, mousePos.y, node.pos.x, node.pos.y) <= node.mass) {
                                selectedNode = node;
                                selectedNodeNumber = index;
                                createNewNode = false;
                                return;
                            }
                        });
        
                        // Create new node
                        if (createNewNode) {
                            nodeCreatedDuringThisClick = true;
                            selectedNode = new GraphNode(s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2), DEFAULT_NODE_SIZE);
                            selectedNodeNumber = graph.getNodes().length;
                            graph.addNode(selectedNode);
                        }
                }
            }
        };

        s.mouseReleased = () => {
            // On release stop dragging node
            clicked = false;
            selectedNode = null;
            nodeCreatedDuringThisClick = false;

            switch (globalThis.state) {
                case DRAW_MODE:
                    let endNode: GraphNode | null = null;
                    const mousePos: Vector = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);

                    graph.getNodes().forEach((node, index) => {
                        if (selectedNodeNumber !== index && s.dist(mousePos.x, mousePos.y, node.pos.x, node.pos.y) <= node.mass) {
                            endNode = node;
                            graph.addEdge(selectedNodeNumber, index, s.random(MIN_CON_LEN, MAX_CON_LEN))
                            return;
                        }
                    });
                case DRAG_MODE:
                default:
                    break;
            }

            selectedNodeNumber = -1;
        };

        const adjustForceForNodes = (nodes: GraphNode[]) => {
            // There are 3 components to force:

            // Bring each node closer to the middle
            nodes.forEach(node => {
                const gravity: Vector = node.pos.copy().mult(-1).mult(GRAVITY_CONST);
                node.force = gravity;
            });

            // Every node is repelled by every other node
            for (let i: number = 0; i < nodes.length; i++) {
                for (let j: number = i + 1; j < nodes.length; j++) {
                    const pos: Vector = nodes[i].pos;
                    const dir: Vector = nodes[j].pos.copy().sub(pos);
                    const force: Vector = dir.div(dir.mag() * dir.mag());
                    force.mult(FORCE_CONSTANT);
                    nodes[i].force.add(force.copy().mult(-1));
                    nodes[j].force.add(force);
                }
            }

            // For each connection, add to the force each node feels by the distance from one to the other
            // Nodes far apart feel a strong force together, nodes close together feel a weak force
            graph.getEdges().forEach(edge => {
                const node1: GraphNode = nodes[edge.node1Id];
                const node2: GraphNode = nodes[edge.node2Id];
                const dis: Vector = node1.pos.copy().sub(node2.pos);
                node1.force.sub(dis);
                node2.force.add(dis);
            })
        };
    };

    // Instantiate sketch
    new p5(sketch, containerId);
}
