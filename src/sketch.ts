import p5 from 'p5';

interface Point {
	x: number;
	y: number;
	vx: number,
	vy: number,
	ax: number,
	ay: number,
}
  

export function createSketch(containerId: HTMLElement) {
	const SKETCH_WIDTH = 550;
	const SKETCH_HEIGHT = 490;

	const CIRCLE_RADIUS = 24;
	const POINT_COLOUR = '#000000';
	
	const LINE_WIDTH = 4;
	const LINE_COLOUR = '#DD0000';
	const BACKGROUND_COLOR = "#90EE90";

	const ACCELERATION_SCALING = 1.5;

	const sketch = (s: p5) => {

		let points: Point[] = [];
		let currentCircleDragged: Point | null = null;
	
		s.setup = () => {
			s.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);
		};
	
		s.draw = () => {
			s.background(BACKGROUND_COLOR);

        	if (currentCircleDragged !== null) {
				if (0 > s.mouseX) {
					currentCircleDragged.x = 0;
				} 
				else if (s.mouseX > SKETCH_WIDTH)
				{
					currentCircleDragged.x = SKETCH_WIDTH;
				}
				else {
					currentCircleDragged.x = s.mouseX;
				}
				if (0 > s.mouseY) {
					currentCircleDragged.y = 0;
				} 
				else if (s.mouseY > SKETCH_HEIGHT)
				{
					currentCircleDragged.y = SKETCH_HEIGHT;
				}
				else {
					currentCircleDragged.y = s.mouseY;
				}
			}
          
			//Draw circles
			s.fill(POINT_COLOUR);
			s.stroke(POINT_COLOUR);
			for (var circle of points) {
				let total_acc_x: number = 0;
				let total_acc_y: number = 0;
				for (var othercircle of points) {
					if (circle !== othercircle) {
						total_acc_x += ACCELERATION_SCALING/(circle.x - othercircle.x);
						total_acc_y += ACCELERATION_SCALING/(circle.y - othercircle.y);
					}
				}

				circle.ax = total_acc_x
				circle.ay = total_acc_y;

				circle.vx += circle.ax
				circle.vy += circle.ay
				circle.x += circle.vx;
				circle.y += circle.vy;

				if (0 > circle.x) {
					circle.x = 0;
				} 
				else if (circle.x > SKETCH_WIDTH)
				{
					circle.x = SKETCH_WIDTH;
				}
				if (0 > circle.y) {
					circle.y = 0;
				} 
				else if (circle.y > SKETCH_HEIGHT)
				{
					circle.y = SKETCH_HEIGHT;
				}

				s.ellipse(circle.x, circle.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
			}
		};

		s.mousePressed = () => {
			if (s.mouseX < 0 || s.mouseY < 0 || s.mouseX > SKETCH_WIDTH || s.mouseY > SKETCH_HEIGHT) {
				return;
			}
				
			s.cursor("grab");
	
			for (let i = 0; i < points.length; i++) {
				if (s.dist(points[i].x, points[i].y, s.mouseX, s.mouseY) <= CIRCLE_RADIUS) {
					currentCircleDragged = points[i];
					return;
				}
			}

			points.push({x: s.mouseX, y: s.mouseY, vx: 0, vy: 0, ax: 0, ay: 0});
            currentCircleDragged = points.slice(-1)[0];
		}
	
		s.mouseReleased = () => {
			if (currentCircleDragged !== null) {
				currentCircleDragged = null;
			}
			s.cursor(s.ARROW);
		}
	};
	
	new p5(sketch, containerId);
}

function randomIntFromInterval(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}