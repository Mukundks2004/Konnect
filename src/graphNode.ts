import { Vector } from "p5";

// Node class
export class GraphNode {
    static currentId: number = 0;
    public pos: Vector;
    public force: Vector;
    public mass: number;
    public id: number;

    constructor(pos: Vector, size: number) {
        this.pos = pos;
        this.force = new p5.Vector(0, 0);
        this.mass = (2 * Math.PI * size) / 1.5;
        this.id = GraphNode.currentId;
        GraphNode.currentId++;
    }

    // Change vel by acc, then pos by vel
    // This means we only have to update the acc and the rest follows
    update() {
        const forceCopy: Vector = this.force.copy();
        const vel: Vector = forceCopy.div(this.mass);
        this.pos.add(vel);
    }

    // A node is just a circle
    draw(s: typeof p5) {
        s.ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    }
}