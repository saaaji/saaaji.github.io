/**
 * Constants
 */
const G = 6.67e-11; // gravitational constant
const C = 3.0e+8; // speed of light

/**
 * Setup
 */
const planet = new AstronomicalObject(1e12);
planet.position.set(500, 500);

const planet1 = new AstronomicalObject(1);
planet1.position.set(500, 400);
planet1.velocity.set(0.5, 0);

const bodies = [planet, planet1];

console.log(Math.sqrt(G * planet.mass / 100));

/**
 * Rendering
 */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', resizeCanvas);
window.dispatchEvent(new Event('resize'));

ctx.fillStyle = 'rgb(20, 20, 20)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

window.requestAnimationFrame(function render() {
  ctx.fillStyle = 'rgba(20, 20, 20, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'white';
  bodies.forEach(body => {
    body.velocity.add(body.acceleration);
    body.position.add(body.velocity);
    body.draw(ctx);
  });
  
  const d2 = planet.position.distanceToSquared(planet1.position);
  
  const F_g = planet
    .position
    .clone()
    .subtract(planet1.position)
    .normalize()
    .scale(G * (planet.mass * planet1.mass) / (d2 + Number.EPSILON));
  
  planet1.acceleration.copy(F_g.clone().scale(1 / planet1.mass));
  planet.acceleration.copy(F_g.clone().scale(1 / planet.mass));
  
  window.requestAnimationFrame(render);
});

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}