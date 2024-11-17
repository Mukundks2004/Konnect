import p5 from 'p5';

export function createSketch(containerId: HTMLElement) {
  const BALL_SIZE = 50;
  const sketch = (p: p5) => {
    let x = 100;
    let y = 100;
    let speedX = 4;
    let speedY = 4;
  
    p.setup = () => {
      p.createCanvas(550, 490);
    };
  
    p.draw = () => {
      p.background('#90EE90');
  
      p.ellipse(x, y, BALL_SIZE, BALL_SIZE);
  
      x += speedX;
      y += speedY;
  
      if (x > p.width - BALL_SIZE / 2 || x < BALL_SIZE / 2) speedX *= -1;
      if (y > p.height - BALL_SIZE / 2 || y < BALL_SIZE / 2) speedY *= -1;
    };
  };
  

  new p5(sketch, containerId);
}