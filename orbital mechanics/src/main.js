import * as vec2 from './vec2.js';
import AstronomicalObject from './AstronomicalObject.js';
import TwoBodySystem from './TwoBodySystem.js';
import Ellipse from '../lib/ellipse.js';

// constants
const SUN_MASS = 1.989e30,
      EARTH_MASS = 5.972e24,
      AU_TO_M = 1.496e11;

const canvas = document.getElementById('canvas');

window.addEventListener('resize', () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});
window.dispatchEvent(new Event('resize'));

const $ = document.querySelector.bind(document);
const uiElements = {
  pickTime: $('#pick-time'),
  showPath: $('#show-points'),
  showEllipse: $('#show-ellipse-fit'),
  showIntervals: $('#show-orbital-intervals'),
  circularOrbit: $('#circular-orbit'),
  pickSpeed: $('#pick-speed'),
  pickAngle: $('#pick-angle'),
  pickRadius: $('#pick-radius'),
  pickMass: $('#pick-mass'),
  startSimulation: $('#start-simulation'),
  orbitalPeriod: $('#orbital-period'),
  semiMajorAxis: $('#semi-major-axis'),
  semiMinorAxis: $('#semi-minor-axis'),
  planetPos: $('#planet-pos'),
  starPos: $('#star-pos'),
  //planetPosLabel: $('#planet-pos-label'),
  //starPosLabel: $('#star-pos-label'),
  ellipseCenterLabel: $('#ellipse-center'),
  ellipseOrientationLabel: $('#ellipse-orientation'),
  ellipseEccentricityLabel: $('#ellipse-eccentricity'),
  //intervalAreasLabel: $('#interval-areas'),
};

uiElements.circularOrbit.addEventListener('change', () => {
  if (uiElements.circularOrbit.checked) {
    uiElements.pickSpeed.setAttribute('disabled', true);
    uiElements.pickAngle.setAttribute('disabled', true);
  } else {
    uiElements.pickSpeed.removeAttribute('disabled');
    uiElements.pickAngle.removeAttribute('disabled');
  }
});

uiElements.startSimulation.addEventListener('click', () => {
  ['startSimulation', 'pickSpeed', 'pickRadius', 'pickAngle', 'pickMass', 'pickTime', 'circularOrbit'].forEach(name => {
    uiElements[name].setAttribute('disabled', true);
  });
  
  window.system = new TwoBodySystem({
    planet: new AstronomicalObject({
      name: 'Planet',
      mass: Number(uiElements.pickMass.value),
      radius: 10,
      color: 'rgb(100, 100, 250)',
      pathColor: 'rgb(100, 250, 250)',
    }),
    star: new AstronomicalObject({
      name: 'Sun',
      mass: SUN_MASS,
      radius: 15,
      color: 'rgb(250, 250, 100)',
      pathColor: 'rgb(250, 100, 250)',
    }),
    timeStep: Number(uiElements.pickTime.value),
    stepsPerUpdate: 1000,
    canvas,
  });
  
  canvas.addEventListener('wheel', ({deltaY}) => {
    system.plotSettings.scale *= deltaY > 0 ? 1.05 : 0.95;
  });
  
  //uiElements.planetPosLabel.style.color = system.planet.color;
  //uiElements.starPosLabel.style.color = system.star.color;
  
  system.plotSettings.showPath = uiElements.showPath.checked;
  uiElements.showPath.addEventListener('change', () => {
    system.plotSettings.showPath = uiElements.showPath.checked;
  });
  system.plotSettings.showEllipse = uiElements.showEllipse.checked;
  uiElements.showEllipse.addEventListener('change', () => {
    system.plotSettings.showEllipse = uiElements.showEllipse.checked;
  });
  system.plotSettings.showIntervals = uiElements.showIntervals.checked;
  uiElements.showIntervals.addEventListener('change', () => {
    system.plotSettings.showIntervals = uiElements.showIntervals.checked;
  });
  
  const speed = Number(uiElements.pickSpeed.value);
  const angle = Number(uiElements.pickAngle.value) * Math.PI / 180;
  
  
  if (!uiElements.circularOrbit.checked) {
    vec2.set(system.planet.velocity, Math.cos(angle) * speed, Math.sin(angle) * speed);
    vec2.set(system.planet.position, Number(uiElements.pickRadius.value) * AU_TO_M, 0);
  } else {
    const tangentialVelocity = Math.sqrt((6.67e-11 * system.star.mass) / (uiElements.pickRadius.value*AU_TO_M));
    vec2.set(system.planet.velocity, 0, tangentialVelocity);
    vec2.set(system.planet.position, Number(uiElements.pickRadius.value) * AU_TO_M, 0);
  }
  
  let paused = false;
  window.addEventListener('keydown', ({key}) => {
    if (key === ' ')
      paused = !paused;
  });
  window.requestAnimationFrame(function render() {
    system.plot();
    
    if (!paused) {
      system.update();
      uiElements.orbitalPeriod.textContent = system.period.toFixed(5) + ' days';
      uiElements.semiMajorAxis.textContent = system.ellipseFit.a.toExponential(2) + ' m';
      uiElements.semiMinorAxis.textContent = system.ellipseFit.b.toExponential(2) + ' m';
      uiElements.ellipseCenterLabel.textContent = `(${system.ellipseFit.h.toExponential(2)}, ${system.ellipseFit.k.toExponential(2)})`;
      uiElements.ellipseOrientationLabel.textContent = `${(system.ellipseFit.theta * 180 / Math.PI).toFixed(5)} degrees`;
      //uiElements.intervalAreasLabel.innerHTML = '<br>'+system.intervalAreas.map(n => '&nbsp;'.repeat(5)+n.toExponential(5)).join('<br>');
      uiElements.ellipseEccentricityLabel.textContent = system.ellipseFit.eccentricity.toFixed(5);
      //uiElements.planetPos.textContent = `(${system.planet.position[0].toExponential(2)}, ${system.planet.position[1].toExponential(2)})`;
      //uiElements.starPos.textContent = `(${system.star.position[0].toExponential(2)}, ${system.star.position[1].toExponential(2)})`;
    }
    
    window.requestAnimationFrame(render);
  });
});