const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// resize listener
window.addEventListener('resize', event => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});
window.dispatchEvent(new Event('resize'));

// scale controls

let minScale = 1e-10, scale = 1, scaleDampener = 0;
window.addEventListener('wheel', ({deltaY}) => {
  scaleDampener += deltaY * scale * 1e-4;
});

window.requestAnimationFrame(function render() {
  
  // update scale
  if (scale + (scaleDampener *= 0.6) < minScale) {
    scale = minScale;
    scaleDampener = 0;
  } else {
    scale += scaleDampener;
  }
  
  
  ctx.setTransform(1, 0, 0, 1, 20, 20);
  ctx.fillStyle = 'rgb(25, 25, 25)';
  ctx.fillRect(-20, -20, canvas.width, canvas.height);
  
  ctx.strokeStyle = 'rgb(50, 50, 50)';
  ctx.fillStyle = 'rgb(200, 200, 200)';
  ctx.font = '15px "Roboto"';

  //let displayScale =
  
  let dSize = 200;
  let size = dSize*scale;
  //console.log(size);
  
  let yScale = 1, xScale = 1;
  while (size > dSize*2) {
    size *= 0.5;
    yScale *= 0.5;
    xScale *= 0.5;
  }
  
  while (size < dSize/2) {
    size *= 2;
    yScale *= 2;
    xScale *= 2;
  }
  
  let x, y, labelText;
  for (x = 0; x*size < canvas.width; x++) {
    for (y = 0; y*size < canvas.height; y++) {
      ctx.lineWidth = 1;
      ctx.strokeRect(x*size, y*size, size, size);
      
      if (y % 2 == 0 && x % 2 == 0) {
        ctx.lineWidth = 2;
        ctx.strokeRect(x*size, y*size, size*2, size*2);
      }
      
      if (x === 0 && y % 2 === 0) {
        labelText = (y*yScale).toString();
        if (labelText.length > 5)
          labelText = (y*yScale).toExponential(2);
        ctx.fillText(labelText, x*size + 5, y*size + 15);
      }
        
      if (y === 0 && x % 2 === 0) {
        labelText = (x*xScale).toString();
        if (labelText.length > 5)
          labelText = (x*xScale).toExponential(2);
        ctx.fillText(labelText, x*size + 5, y*size + 15);
      }
    }
  }
  
  console.log(x*xScale, y*yScale);
  
  // test shapes
  ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.arc(0, 0, 4*dSize*scale, 0, 2*Math.PI);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
  ctx.fillRect(
    10*dSize*scale,
    10*dSize*scale,
    5*dSize*scale,
    5*dSize*scale,
  );
  
  ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(
    100 *dSize*scale,
    500 *dSize*scale,
    100 *dSize*scale,
    50 *dSize*scale,
    0,
    0,
    2*Math.PI
  );
  ctx.fill();
  
  
  
  
  
  window.requestAnimationFrame(render);
});