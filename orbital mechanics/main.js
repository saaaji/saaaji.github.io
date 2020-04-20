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
  
  init() {
    window.addEventListener('wheel', ({deltaY}) => {
      this._dampener += deltaY * this.value * 1e-4;
    });
  },
  
  update() {
    if (this.value + (this._dampener *= 0.6) < this.min) {
      this.value = this.min;
      this._dampener = 0;
    } else {
      this.value += this._dampener;
    }
  },
  
};

// initialize scale
Scale.init();

// initialize background grid
const grid = new Grid({
  cellSize: 50,
  backgroundColor: 'rgb(10, 10, 10)',
  minorGridColor: 'rgb(20, 20, 20)',
  majorGridColor: 'rgb(30, 30, 30)',
  fontName: 'monospace',
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

window.requestAnimationFrame(function render() {
  
  // update scene transform
  ctx.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
  
  // update scale
  Scale.update();
  
  // draw grid
  grid.draw(Scale.value);
  
  // draw objects
  ctx.fillStyle = 'rgba(100, 100, 250, 0.5)';
  ctx.fillRect(
    0,
    0,
    2 * grid.cellSize * Scale.value,
    3 * grid.cellSize * Scale.value,
  );
  
  ctx.fillStyle = 'rgba(100, 250, 100, 0.5)';
  ctx.beginPath();
  ctx.arc(
    1024 * grid.cellSize * Scale.value,
    2048 * grid.cellSize * Scale.value,
    512 * grid.cellSize * Scale.value,
    0,
    2 * Math.PI
  );
  ctx.fill();
  
  ctx.fillStyle = 'rgba(250, 100, 100, 0.5)';
  ctx.beginPath();
  ctx.ellipse(
    1e6 * grid.cellSize * Scale.value,
    1e6 * grid.cellSize * Scale.value,
    4e5 * grid.cellSize * Scale.value,
    0.9e6 * grid.cellSize * Scale.value,
    0,
    0,
    2 * Math.PI,
  );
  ctx.fill();
  
  ctx.fillStyle = 'rgba(100, 250, 250, 0.5)';
  ctx.fillRect(
    1e9 * grid.cellSize * Scale.value,
    1e9 * grid.cellSize * Scale.value,
    5e9 * grid.cellSize * Scale.value,
    2e9 * grid.cellSize * Scale.value,
  );
  
  window.requestAnimationFrame(render);
});