import * as vec2 from './vec2.js';
import AstronomicalObject from './AstronomicalObject.js';
import TwoBodySystem from './TwoBodySystem.js';

// constants
const SUN_MASS = 1.989e30,
      EARTH_MASS = 5.972e24,
      ONE_AU = 1.496e11;

const canvas = document.getElementById('canvas');

const system = new TwoBodySystem({
  planet: new AstronomicalObject({
    name: 'Earth',
    mass: EARTH_MASS,
    radius: 10,
    color: 'rgb(100, 100, 250)',
  }),
  star: new AstronomicalObject({
    name: 'Sun',
    mass: SUN_MASS,
    radius: 15,
    color: 'rgb(250, 250, 100)',
  }),
  timeStep: 100,
  stepsPerUpdate: 2500,
  canvas,
});

// earth initial conditions
vec2.set(system.planet.pos, ONE_AU, 0);
vec2.set(system.planet.vel, 0, 29771);

window.addEventListener('resize', () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});
window.dispatchEvent(new Event('resize'));

window.requestAnimationFrame(function render() {
  system.update();
  system.plot();
  window.requestAnimationFrame(render);
});