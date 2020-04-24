const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// resize listener
window.addEventListener('resize', event => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});
window.dispatchEvent(new Event('resize'));

// scale controls
const Scale = {
  
  value: 1,
  _dampener: 0,
  
  get min() {
    return 1e-10;
  },
  
  get max() {
    return 1;
  },
  
  init() {
    window.addEventListener('wheel', ({deltaY}) => {
      this._dampener += deltaY * this.value * 1e-4;
    });
  },
  
  update() {
    if (this.value + this._dampener < this.min) {
      this.value = this.min;
      this._dampener = 0;
    } else if (this.value + this._dampener > this.max) {
      this.value = this.max;
      this._dampener = 0;
    } else {
      this.value += (this._dampener *= 0.6);
    }
  },
  
};

// initialize scale
Scale.init();

// initialize background grid
const grid = new Grid({
  cellSize: 75,
  backgroundColor: 'rgb(10, 10, 10)',
  minorGridColor: 'rgb(20, 20, 20)',
  majorGridColor: 'rgb(30, 30, 30)',
  fontName: '"Roboto", monospace',
  fontSize: 15,
  fontColor: 'rgb(150, 150, 150)',
  fontPadding: 5,
  majorGridSize: 4,
  majorGridLineWidth: 2,
  minorGridLineWidth: 1,
  drawMinorGrid: true,
  canvas,
  ctx,
});

// constants
const G = 6.67e-11;

// unit conversions


// init
const body1 = new AstronomicalObject(1e10, 5, 'rgb(100, 100, 250)', 'Planet');
const body2 = new AstronomicalObject(1e15, 10, 'rgb(250, 250, 100)', 'Sun');

body1.position.x = 256;
body1.velocity.set(-0.1, 20);

const bodies = [body1, body2];
let timeStep = 1;

window.requestAnimationFrame(function render() {
  
  // update scene transform
  ctx.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
  
  // update scale
  Scale.update();
  
  // draw grid
  grid.draw(Scale.value);
  
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
    
    // update velocity : change in velocity = acceleration * time step
    body.velocity.addScaledVector(body.acceleration, timeStep);
    
    // update position : change in position = velocity * time step
    body.position.addScaledVector(body.velocity, timeStep);
    
    body.draw(ctx, Scale.value * grid.cellSize, true);
  }
  
  const distance = body1.position.distanceTo(body2.position);
  
  // update acceleration : force of gravity = G * M * m / d^2
  const gravityOnBody1 = body2
    .position
    .clone()
    .subtract(body1.position)
    .normalize()
    .scale(G * body1.mass * body2.mass / (distance ** 2 + Number.EPSILON));
    
  const gravityOnBody2 = gravityOnBody1.clone().scale(-1);
  
  body1.acceleration.copy(gravityOnBody1.scale(1 / body1.mass));
  body2.acceleration.copy(gravityOnBody2.scale(1 / body2.mass));
  
  window.requestAnimationFrame(render);
});