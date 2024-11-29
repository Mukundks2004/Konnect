import { Vector } from "p5";
import { Graph } from "./graph";
import { GraphNode } from "./graphNode";

const NODE_COUNT: number = 30;
// const NODE_COUNT: number = 10;
const CONNECTION_COUNT: number = 30;
// const CONNECTION_COUNT: number = 10;
const GRAVITY_CONST: number = 1.3;
const FORCE_CONSTANT: number = 800;
const DO_NODE_MOVEMENT: boolean = true;
const SKETCH_HEIGHT: number = 490;
const SKETCH_WIDTH: number = 550;

const DEFAULT_NODE_SIZE: number = 3;
const LINE_THICKNESS: number = 2;

const MIN_CON_LEN: number = 200;
const MAX_CON_LEN: number = 400;

const DRAG_MODE: string = "Drag";
const DRAW_MODE: string = "Draw";
const DELETE_MODE: string = "Delete";
const CONFIG_MODE: string = "Config";
const ATTRIBUTES_MODE: string = "Attributes";

const LINE_CLICK_TOLERANCE: number = 5;

export function createSketch(containerId: HTMLElement) {
    const sketch = (s: typeof p5) => {

        // Initialize graph
        const graph: Graph = new Graph();

        let clicked: boolean = false;
        let selectedNode: GraphNode | null = null;
        let selectedNodeNumber: number = -1;
        let nodeCreatedDuringThisClick: boolean = false;

        let NODE_COLOUR: string = '#FFA500';
        let BG_COLOUR: string;
        let NODE_BORDER_COLOUR: string;

        s.setup = () => {
            // Create canvas
            s.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);

            BG_COLOUR = adjustColor(NODE_COLOUR, 0.8);
            NODE_BORDER_COLOUR = adjustColor(NODE_COLOUR, -0.4);
            console.log(BG_COLOUR, NODE_BORDER_COLOUR);

            // Fill board with some nodes
            for (let i: number = 0; i < NODE_COUNT; i++) {
                const x: number = s.random(-SKETCH_WIDTH / 4, SKETCH_WIDTH / 4);
                const y: number = s.random(-SKETCH_HEIGHT / 4, SKETCH_HEIGHT / 4);
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
            updateText(graph.toString());
        };

        s.draw = () => {
            // Translate so we can draw at origin
            s.translate(SKETCH_WIDTH / 2, SKETCH_HEIGHT / 2);

            // Colour background light orange and set stroke orange
            s.background(BG_COLOUR);
            s.stroke(NODE_BORDER_COLOUR);

            const allNodes: GraphNode[] = graph.getNodes();

            // Drag selected node
            if (clicked) {
                if (selectedNode) {
                    switch (globalThis.state) {
                        case CONFIG_MODE:
                        case ATTRIBUTES_MODE:
                        case DRAG_MODE:
                            selectedNode.pos.x = s.mouseX - SKETCH_WIDTH / 2;
                            selectedNode.pos.y = s.mouseY - SKETCH_HEIGHT / 2;
                            break;
                        case DRAW_MODE:
                            if (!nodeCreatedDuringThisClick) {
                                s.line(selectedNode.pos.x, selectedNode.pos.y, s.mouseX - SKETCH_WIDTH / 2, s.mouseY - SKETCH_HEIGHT / 2);
                                break;
                            }
                            selectedNode.pos.x = s.mouseX - SKETCH_WIDTH / 2;
                            selectedNode.pos.y = s.mouseY - SKETCH_HEIGHT / 2;
                            break;
                        default:
                            break;
                    }
                }
            }

            // Draw all connections
            graph.getEdges().forEach(edge => {
                const node1: GraphNode = graph.getNodeWithId(edge.node1Id);
                const node2: GraphNode = graph.getNodeWithId(edge.node2Id);
                s.line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
            })

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
                const mousePos: Vector = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);
                switch (globalThis.state) {
                    case DELETE_MODE:
                        graph.getNodes().forEach((node) => {
                            if (s.dist(mousePos.x, mousePos.y, node.pos.x, node.pos.y) <= node.mass / 2) {
                                selectedNodeNumber = node.id;
                                return;
                            }
                        });
                        if (selectedNodeNumber !== -1) {
                            graph.removeNode(selectedNodeNumber);
                            updateText(graph.toString());
                            selectedNodeNumber = -1;
                        }

                        graph.getEdges().forEach((edge) => {
                            if (isMouseOnLine(graph.getNodeWithId(edge.node1Id).pos, graph.getNodeWithId(edge.node2Id).pos, mousePos)) {
                                graph.removeEdge(edge.node1Id, edge.node2Id);
                                updateText(graph.toString());
                                return;
                            }
                        })
                        break;
                    case DRAW_MODE:
                    case DRAG_MODE:
                    case CONFIG_MODE:
                    case ATTRIBUTES_MODE:
                    default:
                        let createNewNode: boolean = true;
        
                        // Select node we are hovering over
                        graph.getNodes().forEach((node) => {
                            if (s.dist(mousePos.x, mousePos.y, node.pos.x, node.pos.y) <= node.mass / 2) {
                                selectedNode = node;
                                selectedNodeNumber = node.id;
                                createNewNode = false;
                                return;
                            }
                        });
        
                        // Create new node
                        if (createNewNode) {
                            nodeCreatedDuringThisClick = true;
                            selectedNode = new GraphNode(s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2), DEFAULT_NODE_SIZE);
                            selectedNodeNumber = selectedNode.id;
                            graph.addNode(selectedNode);
                            updateText(graph.toString());
                        }
                        break;
                }
            }
        };

        s.mouseReleased = () => {
            // On release stop dragging node
            clicked = false;
            selectedNode = null;
            nodeCreatedDuringThisClick = false;

            const mousePos: Vector = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);
            switch (globalThis.state) {
                case DRAW_MODE:
                    graph.getNodes().forEach((node) => {
                        if (s.dist(mousePos.x, mousePos.y, node.pos.x, node.pos.y) <= node.mass / 2 && selectedNodeNumber !== -1) {
                            console.log("edge from " + selectedNodeNumber + " to " + node.id);
                            graph.addEdge(selectedNodeNumber, node.id, s.random(MIN_CON_LEN, MAX_CON_LEN));
                            updateText(graph.toString());
                            return;
                        }
                    });
                case DRAG_MODE:
                case CONFIG_MODE:
                case ATTRIBUTES_MODE:
                case DELETE_MODE:
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
                const node1: GraphNode = graph.getNodeWithId(edge.node1Id);
                const node2: GraphNode = graph.getNodeWithId(edge.node2Id);
                const dis: Vector = node1.pos.copy().sub(node2.pos);
                node1.force.sub(dis);
                node2.force.add(dis);
            })
        };

        function isMouseOnLine(firstPoint: Vector, secondPoint: Vector, mousePoint: Vector) {
            const d: number = distToLine(firstPoint, secondPoint, mousePoint);
            
            if (d <= LINE_CLICK_TOLERANCE) {
                const minX: number = Math.min(firstPoint.x, secondPoint.x);
                const maxX: number = Math.max(firstPoint.x, secondPoint.x);
                const minY: number = Math.min(firstPoint.y, secondPoint.y);
                const maxY: number = Math.max(firstPoint.y, secondPoint.y);
                
                if (mousePoint.x >= minX && mousePoint.x <= maxX && mousePoint.y >= minY && mousePoint.y <= maxY) {
                    return true;
                }
            }
            return false;
        }

        function updateText(newText: string): void {
            const event: CustomEvent = new CustomEvent<string>('textUpdated', { detail: newText.toString() });
            window.dispatchEvent(event);
        }

        function distToLine(firstPoint: Vector, secondPoint: Vector, mousePoint: Vector): number {
            const lineVector = secondPoint.copy().sub(firstPoint.copy());
            const pointVector = mousePoint.copy().sub(firstPoint.copy());
            const crossProd = lineVector.cross(pointVector);
            const crossProdMagnitude = crossProd.mag();
            const lineMagnitude = lineVector.mag();
        
            return crossProdMagnitude / lineMagnitude;
        }

        window.addEventListener('colourChanged', function(event: Event) {
            const customEvent: CustomEvent<string> = event as CustomEvent<string>;
            NODE_COLOUR = customEvent.detail;
            BG_COLOUR = adjustColor(NODE_COLOUR, 0.8);
            NODE_BORDER_COLOUR = adjustColor(NODE_COLOUR, -0.4);
        });
    };

    // Instantiate sketch
    new p5(sketch, containerId);
}

function adjustColor(hex: string, percent: number) {
    hex = hex.replace('#', '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    const adjust = (colorValue: number, percent: number) => {
        return percent > 0 ? 
            Math.min(255, colorValue + (255 - colorValue) * percent) :
            Math.max(0, colorValue + colorValue * percent)
    };

    r = adjust(r, percent);
    g = adjust(g, percent);
    b = adjust(b, percent);

    const newHex = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    
    return newHex;
}
