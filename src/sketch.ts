// Define the sketch using instance mode
import p5 from 'p5'; // You can import p5 directly after installing @types/p5

export const sketch = (p: p5) => {
  // Variables for the ball's position and speed
  let x = 100;
  let y = 100;
  let speedX = 2;
  let speedY = 2;

  // Setup function: this runs once at the beginning
  p.setup = () => {
    p.createCanvas(400, 550); // Create a 400x400 pixel canvas
    p.background(220); // Set the background color
  };

  // Draw function: this runs repeatedly
  p.draw = () => {
    p.background(220); // Redraw the background each frame

    // Draw the bouncing ball
    p.ellipse(x, y, 50, 50); // Draw a circle at position (x, y)

    // Update the ball's position
    x += speedX;
    y += speedY;

    // Bounce the ball off the edges of the canvas
    if (x > p.width || x < 0) speedX *= -1;
    if (y > p.height || y < 0) speedY *= -1;
  };
};
