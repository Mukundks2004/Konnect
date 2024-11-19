import p5, { Vector } from 'p5';

// Node class
class Node {
    pos: p5.Vector;
    force: p5.Vector;
    mass: number;

    constructor(pos: p5.Vector, size: number) {
        this.pos = pos;
        this.force = new p5.Vector(0, 0);
        this.mass = (2 * Math.PI * size) / 1.5;
    }

    // Change vel by acc, then pos by vel
    // This means we only have to update the acc and the rest follows
    update() {
        const forceCopy: Vector = this.force.copy();
        const vel: Vector = forceCopy.div(this.mass);
        this.pos.add(vel);
    }

    // A node is just a circle
    draw(s: p5) {
        s.ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    }
}

const NODE_COUNT: number = 30;
const CONNECTION_COUNT: number = 30;
const GRAVITY_CONST: number = 1.3;
const FORCE_CONSTANT: number = 800;
const DO_NODE_MOVEMENT: boolean = true;
const SKETCH_HEIGHT: number = 490;
const SKETCH_WIDTH: number = 550;

const DEFAULT_NODE_SIZE = 3;
const LINE_THICKNESS = 2;

const BG_COLOUR = '#FFCEAE';
const NODE_BORDER_COLOUR = '#C65102';
const NODE_COLOUR = '#FFA500';

const MIN_CON_LEN = 200;
const MAX_CON_LEN = 400;

export function createSketch(containerId: HTMLElement) {
    const sketch = (s: p5) => {

        // Initialize graph
        const nodes: Node[] = [];
        const nodeCon: [number, number, number][] = [];

        let clicked: boolean = false;
        let selectedNode: Node | null = null;

        s.setup = () => {
            // Create canvas
            s.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);

            // Fill board with some nodes
            for (let i = 0; i < NODE_COUNT; i++) {
                const x = s.random(-SKETCH_WIDTH / 4, SKETCH_WIDTH / 4);
                const y = s.random(-SKETCH_HEIGHT / 4, SKETCH_HEIGHT / 4);
                const node = new Node(s.createVector(x, y), DEFAULT_NODE_SIZE);
                nodes.push(node);
            }

            // Generate sample connections
            for (let n = 0; n < CONNECTION_COUNT; n++) {
                nodeCon.push([
                    Math.round(s.random(NODE_COUNT - 1)),
                    Math.round(s.random(NODE_COUNT - 1)),
                    s.random(MIN_CON_LEN, MAX_CON_LEN)
                ]);
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

            // Draw all connections
            nodeCon.forEach(con => {
                const node1: Node = nodes[con[0]];
                const node2: Node = nodes[con[1]];
                s.line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
            });

            // Move all nodes
            adjustForceForNodes(nodes);

            // Draw all nodes
            s.fill(NODE_COLOUR);
            nodes.forEach(node => {
                node.draw(s);
                if (DO_NODE_MOVEMENT) {
                    node.update();
                }
            });

            // Drag selected node
            if (clicked) {
                if (selectedNode) {
                    selectedNode.pos.x = s.mouseX - SKETCH_WIDTH / 2;
                    selectedNode.pos.y = s.mouseY - SKETCH_HEIGHT / 2;
                }
            }
        };

        s.mousePressed = () => {
            if (s.mouseX > 0 && s.mouseX < SKETCH_WIDTH && s.mouseY > 0 && s.mouseY < SKETCH_HEIGHT) {
                clicked = true;
                let createNewNode: boolean = true;
                const mousePos: Vector = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);

                // Select node we are hovering over
                nodes.forEach((node) => {
                    if (Vector.dist(mousePos, node.pos) <= node.mass) {
                        // This shouldn't bug as long as nodes don't overlap
                        selectedNode = node;
                        createNewNode = false;
                        return;
                    }
                });

                // Create new node
                if (createNewNode) {
                    nodes.push(new Node(s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2), DEFAULT_NODE_SIZE));
                }
            }
        };

        s.mouseReleased = () => {
            // On release stop dragging node
            clicked = false;
            selectedNode = null;
        };

        const adjustForceForNodes = (nodes: Node[]) => {
            // There are 3 components to force:

            // Bring each node closer to the middle
            nodes.forEach(node => {
                const gravity: Vector = node.pos.copy().mult(-1).mult(GRAVITY_CONST);
                node.force = gravity;
            });

            // Every node is repelled by every other node
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
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
            nodeCon.forEach(con => {
                const node1: Node = nodes[con[0]];
                const node2: Node = nodes[con[1]];
                const dis: Vector = node1.pos.copy().sub(node2.pos);
                node1.force.sub(dis);
                node2.force.add(dis);
            });
        };
    };

    // Instantiate sketch
    new p5(sketch, containerId);
}
