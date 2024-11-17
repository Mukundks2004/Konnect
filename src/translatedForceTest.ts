import p5 from 'p5';

class Node {
    pos: p5.Vector;
    force: p5.Vector;
    mass: number;

    constructor(pos: p5.Vector, size: number) {
        this.pos = pos;
        this.force = new p5.Vector(0, 0);
        this.mass = (2 * Math.PI * size) / 1.5;
    }

    update() {
        let forceCopy = this.force.copy();
        let vel = forceCopy.div(this.mass);
        this.pos.add(vel);
    }

    draw(s: p5) {
        s.ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    }
}

let noNodes: number = 30;
let noConn: number = 30;
let gravityConstant: number = 1.1;
let forceConstant: number = 1000;
let physics: boolean = true;
let nodeCon: [number, number, number][] = [];
let clicked: boolean = false;
let lerpValue: number = 0.2;
let startDisMultiplier: number = 10;
let closeNode: Node | undefined;
const SKETCH_HEIGHT = 490;
const SKETCH_WIDTH = 550;

export function createSketch(containerId: HTMLElement) {
    const sketch = (s: p5) => {
        let nodes: Node[] = [];

        s.setup = () => {
            s.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);
            s.fill(0);

            for (let i = 0; i < noNodes; i++) {
                let x = s.random(-startDisMultiplier * s.width, startDisMultiplier * s.width);
                let y = s.random(-startDisMultiplier * s.height, startDisMultiplier * s.height);
                let node = new Node(s.createVector(x, y), s.random(1, 5));
                nodes.push(node);
            }
            closeNode = nodes[0];

            for (let n = 0; n < noConn; n++) {
                nodeCon.push([
                    Math.round(s.random(noNodes - 1)),
                    Math.round(s.random(noNodes - 1)),
                    s.random(100, 300)
                ]);
            }
            
            nodeCon.push([0, 1, 200]);

            let connected = new Set<number>();
            nodeCon.forEach(conn => {
                connected.add(conn[0]);
                connected.add(conn[1]);
            });

            for (let n = 0; n < noNodes; n++) {
                if (!connected.has(n)) {
                    nodeCon.push([
                        n, 
                        Math.round(s.random(noNodes - 1)), 
                        s.random(100, 300)
                    ]);
                }
            }
        };

        s.draw = () => {
            s.translate(s.width / 2, s.height / 2);
            s.background(255);

            nodeCon.forEach(con => {
                let node1 = nodes[con[0]];
                let node2 = nodes[con[1]];
                s.line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
            });

            applyForces(nodes);

            nodes.forEach(node => {
                node.draw(s);
                if (physics) {
                    node.update();
                }
            });

            if (clicked) {
                let mousePos = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);
                if (closeNode) {
                    closeNode.pos.lerp(mousePos, lerpValue);
                    if (lerpValue < 0.95) {
                        lerpValue += 0.02;
                    }
                }
            }
        };

        s.mousePressed = () => {
            if (s.mouseX > 0 && s.mouseX < SKETCH_WIDTH && s.mouseY > 0 && s.mouseY < SKETCH_HEIGHT) {
                clicked = true;
                let mousePos = s.createVector(s.mouseX - s.width / 2, s.mouseY - s.height / 2);
                closeNode = nodes[0];
                nodes.forEach((node) => {
                    if (closeNode) {
                        let distToNode = mousePos.copy().sub(node.pos).mag() - node.mass / (2 * Math.PI);
                        let distToCloseNode = mousePos.copy().sub(closeNode.pos).mag() - closeNode.mass / (2 * Math.PI);
                        if (distToNode < distToCloseNode) {
                            closeNode = node;
                        }
                    }
                });
            }
        };

        s.mouseReleased = () => {
            clicked = false;
            lerpValue = 0.2;
        };

        const applyForces = (nodes: Node[]) => {
            nodes.forEach(node => {
                let gravity = node.pos.copy().mult(-1).mult(gravityConstant);
                node.force = gravity;
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    let pos = nodes[i].pos;
                    let dir = nodes[j].pos.copy().sub(pos);
                    let force = dir.div(dir.mag() * dir.mag());
                    force.mult(forceConstant);
                    nodes[i].force.add(force.copy().mult(-1));
                    nodes[j].force.add(force);
                }
            }

            nodeCon.forEach(con => {
                let node1 = nodes[con[0]];
                let node2 = nodes[con[1]];
                let maxDis = con[2];
                let dis = node1.pos.copy().sub(node2.pos);
                let diff = dis.mag() - maxDis;
                node1.force.sub(dis);
                node2.force.add(dis);
            });
        };
    };

    new p5(sketch, containerId);
}
