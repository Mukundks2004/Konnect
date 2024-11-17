// import p5 from 'p5';

// var noNodes = 100;
// var noConn = 50;
// var gravityConstant = 1.1;
// var forceConstant = 1000;
// var physics = true;

// var nodes: = [];
// var nodeCon = [];
// var clicked = false;
// var lerpValue = 0.2;
// var startDisMultiplier = 10;
// var closeNode;
// var closeNodeMag;


// export function createSketch(containerId: HTMLElement) {
//     const sketch = (s: p5) => {
//         s.setup = () => {
//             s.createCanvas(600, 600);
//             s.fill(0)
//             for (let i = 0; i < noNodes; i++) {
//               let x = s.random(-startDisMultiplier*width , startDisMultiplier*width)
//               let y = s.random(-startDisMultiplier*height , startDisMultiplier*height)
//               node = new Node(createVector(x, y), random(1, 5))
//               nodes.push(node);
//             }
//             closeNode = nodes[0]
//             for (let n = 0; n < noConn; n++) {
//               nodeCon.push([
//                 round(random(noNodes - 1)),
//                 round(random(noNodes - 1)),
//                 random(100, 300)
//               ])
//             }
//             nodeCon.push([0,1,200])
            
//             // lets add a connection from all solo nodes for good measure
            
//             let connected = new Set()
//             nodeCon.forEach(conn=>{
//               connected.add(conn[0])
//               connected.add(conn[1])
//             })
            
//             for (let n = 0; n < noNodes; n++) {
//               if (!connected.has(n)){
//                   nodeCon.push([
//                     n, 
//                     round(random(noNodes - 1)), 
//                     random(100, 300)
//                     ]
//                   )
//               }
//             }
//         };

//         s.draw = () => {
//             s.translate(width / 2, height / 2)
//             s.background(255);
//               nodeCon.forEach(con => {
//               node1 = nodes[con[0]]
//               node2 = nodes[con[1]]
//               s.line(node1.pos.x, node1.pos.y,
//                 node2.pos.x, node2.pos.y)
//             })
//             applyForces(nodes)
//             nodes.forEach(node => {
//               node.draw()
//               if (physics) {
//                 node.update()
//               }
//             })
//             if (clicked == true) {
//               let mousePos = s.createVector(mouseX-width/2, mouseY-height/2)
//               closeNode.pos.lerp(mousePos, lerpValue)
//               if (lerpValue < 0.95) {
//                   lerpValue+=0.02;
//               }
//             }
//         };

//         s.touchStarted = () => {
//             clicked = true
//             let mousePos = s.createVector(mouseX-width/2, mouseY-height/2)
//             nodes.forEach((node)=>{
//               if (mousePos.copy().sub(node.pos).mag() - closeNode.mass/(2 * PI) < mousePos.copy().sub(closeNode.pos).mag() - closeNode.mass/(2 * PI))
//                 closeNode = node;
//             })
//         }

//         function touchEnded() {
//             clicked = false
//             lerpValue = 0.2
//         }

//         function applyForces(nodes) {

//             // apply force towards centre
//             nodes.forEach(node => {
//               gravity = node.pos.copy().mult(-1).mult(gravityConstant)
//               node.force = gravity
//             })
          
//             // apply repulsive force between nodes
//             for (let i = 0; i < nodes.length; i++) {
//                 for (let j = i + 1; j < nodes.length; j++) {
//                     pos = nodes[i].pos
//                     dir = nodes[j].pos.copy().sub(pos)
//                     force = dir.div(dir.mag() * dir.mag())
//                     force.mult(forceConstant)
//                     nodes[i].force.add(force.copy().mult(-1))
//                     nodes[j].force.add(force)
//                 }
//             }
          
//             // apply forces applied by connections
//             nodeCon.forEach(con => {
//               let node1 = nodes[con[0]]
//               let node2 = nodes[con[1]]
//               let maxDis = con[2]
//               let dis = node1.pos.copy().sub(node2.pos)
//               diff = dis.mag() - maxDis
//               node1.force.sub(dis)
//               node2.force.add(dis)
//             })
//         }

//         function Node(sketch, pos, size) {
//             this.pos = pos
//             this.force = sketch.createVector(0, 0)
//             this.mass = (2 * PI * size)/1.5
//         }
          
//         Node.prototype.update = function() {
//             force = this.force.copy()
//             vel = force.copy().div(this.mass)
//             this.pos.add(vel)
//         }
          
//         Node.prototype.draw = function() {
//             ellipse(this.pos.x, this.pos.y, this.mass, this.mass)
//         }
//     }
// }







