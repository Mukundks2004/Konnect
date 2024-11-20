// // import p5, { Vector } from 'p5';

// import { Vector } from "p5";

// class Graph {
//     public adjList: Map<Node, Map<Node, number>>;
//     public nodeCount: number;
//     public edgeCount: number;
  
//     constructor() {
//       this.adjList = new Map<Node, Map<Node, number>>();
//       this.nodeCount = 0;
//       this.edgeCount = 0;
//     }
  
//     addNode(node: Node): void {
//       if (!this.adjList.has(node)) {
//         this.adjList.set(node, new Map<Node, number>());
//         this.nodeCount += 1;
//       }
//     }
  
//     addEdge(node1: Node, node2: Node, weight: number): void {
//       // Add nodes if they don't exist
//       if (!this.adjList.has(node1)) {
//         this.addNode(node1);
//       }
//       if (!this.adjList.has(node2)) {
//         this.addNode(node2);
//       }
  
//       // Add the edge, undirected
//       this.adjList.get(node1)!.set(node2, weight);
//       this.edgeCount += 1;
//     }

//     removeEdge(node1: Node, node2: Node): void {
//         if (this.adjList.has(node1) && this.adjList.has(node2)) {
//           this.adjList.get(node1)!.delete(node2);
//           this.edgeCount -= 1;
//         }
//     }
    
//     removeNode(node: Node): void {
//         if (this.adjList.has(node)) {
//           // Remove all edges to this node from other nodes
//           for (let adjacent of this.adjList.get(node)!.keys()) {
//             this.adjList.get(adjacent)!.delete(node);
//             this.edgeCount -= 1;
//           }
//           this.adjList.delete(node);
//           this.nodeCount -= 1;
//         }
//     }

//     getAllNodes(): Node[] {
//         return [...this.adjList.keys()];
//     }
// }

// // Node class
// class Node {
//     pos: Vector;
//     force: Vector;
//     mass: number;

//     constructor(pos: Vector, size: number) {
//         this.pos = pos;
//         this.force = new p5.Vector(0, 0);
//         this.mass = (2 * Math.PI * size) / 1.5;
//     }

//     // Change vel by acc, then pos by vel
//     // This means we only have to update the acc and the rest follows
//     update() {
//         const forceCopy: Vector = this.force.copy();
//         const vel: Vector = forceCopy.div(this.mass);
//         this.pos.add(vel);
//     }

//     // A node is just a circle
//     draw(s: typeof p5) {
//         s.ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
//     }
// }

// const NODE_COUNT: number = 5;
// const CONNECTION_COUNT: number = 0;
// const GRAVITY_CONST: number = 1.3;
// const FORCE_CONSTANT: number = 800;
// const DO_NODE_MOVEMENT: boolean = true;
// const SKETCH_HEIGHT: number = 490;
// const SKETCH_WIDTH: number = 550;

// const DEFAULT_NODE_SIZE: number = 3;
// const LINE_THICKNESS: number = 2;

// const BG_COLOUR: string = '#FFCEAE';
// const NODE_BORDER_COLOUR: string = '#C65102';
// const NODE_COLOUR: string = '#FFA500';

// const MIN_CON_LEN: number = 200;
// const MAX_CON_LEN: number = 400;

// const DRAG_MODE = "Drag";
// const DRAW_MODE = "Draw";
// const DELETE_MODE = "Delete";

// export function createSketch(containerId: HTMLElement) {
//     const sketch = (s: typeof p5) => {

//         // Initialize graph
//         //const nodes: Node[] = [];
//         //const nodeCon: [number, number, number][] = [];

//         const myGraph: Graph = new Graph();

//         let clicked: boolean = false;
//         let selectedNode: Node | null = null;
//         let nodeCreatedDuringThisClick: boolean = false;

//         s.setup = () => {
//             // Create canvas
//             s.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);

//             // Fill board with some nodes
//             for (let i = 0; i < NODE_COUNT; i++) {
//                 const x: Vector = s.random(-SKETCH_WIDTH / 4, SKETCH_WIDTH / 4);
//                 const y: Vector = s.random(-SKETCH_HEIGHT / 4, SKETCH_HEIGHT / 4);
//                 const node: Node = new Node(s.createVector(x, y), DEFAULT_NODE_SIZE);
//                 myGraph.addNode(node);
//             }

//             // Generate sample connections
//             // Note: this makes connections between the same node (loops)
//             // It also allows multiple connections
//             for (let n: number = 0; n < CONNECTION_COUNT; n++) {
//                 const allNodes = myGraph.getAllNodes();
//                 myGraph.addEdge(
//                     allNodes[s.random(NODE_COUNT - 1)],
//                     allNodes[s.random(NODE_COUNT - 1)],
//                     s.random(MIN_CON_LEN, MAX_CON_LEN)
//                 );

//             }

//             // Set stroke weight
//             s.strokeWeight(LINE_THICKNESS);
//         };

//         s.draw = () => {
//             // Translate so we can draw at origin
//             s.translate(SKETCH_WIDTH / 2, SKETCH_HEIGHT / 2);

//             // Colour background light orange and set stroke orange
//             s.background(BG_COLOUR);
//             s.stroke(NODE_BORDER_COLOUR);

//             // Draw all connections
//             myGraph.adjList.forEach((neighbors, node1) => {
//                 neighbors.forEach((_, node2) => {
//                     s.line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
//                 });
//             });

//             // Move all nodes
//             adjustForceForNodes(myGraph.getAllNodes());

//             // Drag selected node
//             if (clicked) {
//                 if (selectedNode) {
//                     switch (globalThis.state) {
//                         case DRAW_MODE:
//                             if (!nodeCreatedDuringThisClick) {
//                                 s.line(selectedNode.pos.x, selectedNode.pos.y, s.mouseX - SKETCH_WIDTH / 2, s.mouseY - SKETCH_HEIGHT / 2);
//                                 break;
//                             }
//                         case DRAG_MODE:
//                         default:
//                             selectedNode.pos.x = s.mouseX - SKETCH_WIDTH / 2;
//                             selectedNode.pos.y = s.mouseY - SKETCH_HEIGHT / 2;
//                     }
//                 }
//             }

//             // Draw all nodes
//             s.fill(NODE_COLOUR);
//             myGraph.getAllNodes().forEach(node => {
//                 node.draw(s);
//                 if (DO_NODE_MOVEMENT) {
//                     node.update();
//                 }
//             });
//         };

//         s.mousePressed = () => {
//             if (s.mouseX > 0 && s.mouseX < SKETCH_WIDTH && s.mouseY > 0 && s.mouseY < SKETCH_HEIGHT) {
//                 clicked = true;
//                 switch (globalThis.state) {
//                     case DELETE_MODE:
//                     case DRAW_MODE:
//                     case DRAG_MODE:
//                     default:
//                         let createNewNode: boolean = true;
//                         const mousePos: Vector = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);
        
//                         // Select node we are hovering over
//                         myGraph.getAllNodes().forEach((node, index) => {
//                             if (s.dist(mousePos.x, mousePos.y, node.pos.x, node.pos.y) <= node.mass) {
//                                 // This shouldn't bug as long as nodes don't overlap
//                                 selectedNode = node;
//                                 createNewNode = false;
//                                 return;
//                             }
//                         });
        
//                         // Create new node
//                         if (createNewNode) {
//                             nodeCreatedDuringThisClick = true;
//                             selectedNode = new Node(s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2), DEFAULT_NODE_SIZE);
//                             myGraph.addNode(selectedNode);
//                         }
//                 }
//             }
//         };

//         // Consider what variables need to be mutated given the current state, each time you add a state
//         s.mouseReleased = () => {
//             // On release stop dragging node
//             nodeCreatedDuringThisClick = false;

//             switch (globalThis.state) {
//                 case DRAW_MODE:
//                     let endNode: Node | null = null;
//                     const mousePos: Vector = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);

//                     myGraph.getAllNodes().forEach((node, index) => {
//                         if (s.dist(mousePos.x, mousePos.y, node.pos.x, node.pos.y) <= node.mass) {
//                             endNode = node;
//                             if (endNode !== selectedNode) {
//                                 if (selectedNode != null) {
//                                     myGraph.addEdge(selectedNode, node, s.random(MIN_CON_LEN, MAX_CON_LEN))
//                                 }
//                             }
//                             return;
//                         }
//                     });
//                 case DRAG_MODE:
//                 default:
//                     break;
//             }

//             selectedNode = null;
//             clicked = false;

//         };

//         const adjustForceForNodes = (nodes: Node[]) => {
//             // There are 3 components to force:

//             // Bring each node closer to the middle
//             nodes.forEach(node => {
//                 const gravity: Vector = node.pos.copy().mult(-1).mult(GRAVITY_CONST);
//                 node.force = gravity;
//             });

//             // Every node is repelled by every other node
//             for (let i: number = 0; i < nodes.length; i++) {
//                 for (let j: number = i + 1; j < nodes.length; j++) {
//                     const pos: Vector = nodes[i].pos;
//                     const dir: Vector = nodes[j].pos.copy().sub(pos);
//                     const force: Vector = dir.div(dir.mag() * dir.mag());
//                     force.mult(FORCE_CONSTANT);
//                     nodes[i].force.add(force.copy().mult(-1));
//                     nodes[j].force.add(force);
//                 }
//             }

//             // For each connection, add to the force each node feels by the distance from one to the other
//             // Nodes far apart feel a strong force together, nodes close together feel a weak force
//             myGraph.adjList.forEach((neighbors, node1) => {
//                 neighbors.forEach((_, node2) => {
//                   if (node1 !== node2) {
          
//                     const dis = node1.pos.copy().sub(node2.pos);
//                     node1.force.sub(dis);
//                     node2.force.add(dis);
//                   }
//                 });
//               });
//         };
//     };

//     // Instantiate sketch
//     new p5(sketch, containerId);
// }
