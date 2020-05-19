import * as vec2 from './vec2.js';
import Ellipse from '../lib/ellipse.js';

// constants
const GRAVITATIONAL_CONSTANT = 6.67e-11;
const PI_2 = Math.PI * 2;
const EPSILON = 1e-15;

// unit conversion factors
const AU_TO_PX = 300, // astronomical units to screen pixels
      M_TO_AU = 6.68459e-12, // meters to astronomical units
      M_TO_PX = M_TO_AU * AU_TO_PX, // meters to screen pixels
      S_TO_DAYS = 1 / (60 * 60 * 24), // seconds to days
      DAYS_TO_S = (60 * 60 * 24); // days to seconds
      
// util
const approxEquals = (a, b, t) => Math.abs(a - b) < t;

const rad = d => d * Math.PI / 180;
const ONE_DEGREE = rad(1);

const triangleArea = (p1, p2, p3) => {
  // uses Heron's formula
  const a = vec2.distanceTo(p1, p2),
        b = vec2.distanceTo(p1, p3),
        c = vec2.distanceTo(p2, p3),
        s = (a + b + c) / 2;
        
  return Math.sqrt(s*(s - a)*(s - b)*(s - c));
};

const lastIdx = a => a.length - 1;

export default class TwoBodySystem {
  constructor({
    star,
    planet,
    timeStep,
    stepsPerUpdate,
    canvas,
  }) {
    // initialization
    this.star = star;
    this.planet = planet;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    
    // simulation parameters
    this.timeStep = timeStep;
    this.stepsPerUpdate = stepsPerUpdate;
    
    // internal state
    this._previousPreviousAngle = 0;
    this._previousAngle = 0;
    this._currentAngle = 0;
    
    this._worldTime = 0;
    this._previousTime = 0;
    this._currentTime = 0;
    this._previousPeriodOcurrence = 0;
    this._period = 0;
    
    this._orbitalPositions = [];
    this.ellipseFit = {
      conic: new Ellipse(),
      h: 0,
      k: 0,
      a: 0,
      b: 0,
      theta: 0,
      eccentricity: 0,
    };
    
    this.intervalSize = 5;
    this._orbitalIntervals = [];
    this.intervalAreas = [];
    
    // plotting parameters
    this.plotSettings = {
      backgroundColor: 'rgb(20, 20, 20)',
      showPath: true,
      showEllipse: true,
      showIntervals: true,
      ellipseColor: 'rgb(250, 100, 100)',
      intervalColor: 'rgba(250, 160, 100, 0.5)',
      scale: 1,
    };
  }
  get worldTime() {
    return this._worldTime;
  }
  get period() {
    return this._period * S_TO_DAYS;
  }
}

TwoBodySystem.prototype.plot = function plot() {
  // clear canvas
  this._ctx.setTransform(1, 0, 0, 1, 0, 0);
  this._ctx.fillStyle = this.plotSettings.backgroundColor;
  this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  
  // set transform
  const scale = M_TO_PX * this.plotSettings.scale;
  
  this._ctx.setTransform(
    1,
    0,
    0,
    -1,
    this._canvas.width * 0.5 - this.star.position[0] * scale,
    this._canvas.height * 0.5 + this.star.position[1] * scale,
  );
  
  this._ctx.lineWidth = 2;
  
  // plot path of sun and planet
  if (this.plotSettings.showPath) {
    this.planet.plotPath(this._ctx, scale);
    this.star.plotPath(this._ctx, scale);
  }
  
  // plot ellipse of best fit
  if (this.plotSettings.showEllipse) {
    this._ctx.beginPath();
    this._ctx.strokeStyle = this.plotSettings.ellipseColor;
    this._ctx.ellipse(
      this.ellipseFit.h * scale,
      this.ellipseFit.k * scale,
      this.ellipseFit.a * scale,
      this.ellipseFit.b * scale,
      this.ellipseFit.theta,
      0,
      PI_2,
    );
    this._ctx.stroke();
  }
  
  // plot intervals
  if (this.plotSettings.showIntervals) {
    this._ctx.fillStyle = this.plotSettings.intervalColor;
    this._orbitalIntervals.forEach(interval => {
      this._ctx.beginPath();
      this._ctx.moveTo(...this.star.position.map(n => n * scale));
      this._ctx.lineTo(...interval[0].map(n => n * scale));
      this._ctx.lineTo(...interval[1].map(n => n * scale));
      this._ctx.fill();
    });
  }
  
  // plot sun and planet
  this.planet.plot(this._ctx, scale);
  this.star.plot(this._ctx, scale);
}

TwoBodySystem.prototype.updateGravitationalAcceleration = (() => {
  const planetToStar = vec2.create(),
        gravityOnPlanet = vec2.create();
  
  return function updateGravitationalAcceleration() {
    vec2.sub(planetToStar, this.star.position, this.planet.position);
    vec2.norm(planetToStar, planetToStar);
    
    const distance = vec2.distanceTo(this.planet.position, this.star.position);
    const gravityMagnitude = GRAVITATIONAL_CONSTANT * this.planet.mass * this.star.mass / distance**2;
    vec2.scale(gravityOnPlanet, planetToStar, gravityMagnitude);
    
    vec2.scale(this.planet.acceleration, gravityOnPlanet, 1 / this.planet.mass);
    vec2.scale(this.star.acceleration, vec2.negate(gravityOnPlanet, gravityOnPlanet), 1 / this.star.mass);
  }
})();

TwoBodySystem.prototype.update = (() => {
  const planetToStar = vec2.create();
  
  return function update() {
    for (let i = 0; i < this.stepsPerUpdate; i++) {
      // increment total simulation time
      this._worldTime += this.timeStep;
      
      // update sun and planet
      this.updateGravitationalAcceleration();
      this.planet.update(this.timeStep);
      this.star.update(this.timeStep);
      
      // calculate angle between sun and planet
      vec2.sub(planetToStar, this.star.position, this.planet.position);
      this._previousPreviousAngle = this._previousAngle;
      this._previousAngle = this._currentAngle;
      this._currentAngle = Math.atan2(planetToStar[1], planetToStar[0]);
      
      if (this._worldTime % DAYS_TO_S === 0) {
        this._orbitalPositions.push(vec2.clone(this.planet.position));
        this.planet.savePosition();
        this.star.savePosition();
      }
      
      // update current and previous times
      this._previousTime = this._currentTime;
      this._currentTime = this._worldTime;
      
      // if planet has crossed 0 degrees, it has undergone a full period
      if (this._previousAngle < this._previousPreviousAngle &&
          this._previousAngle < this._currentAngle) {
        this._period = this._previousTime - this._previousPeriodOcurrence;
        this._previousPeriodOcurrence = this._previousTime;
        
        // calculate ellipse of best fit for orbital data
        this.ellipseFit.conic.setFromPoints(this._orbitalPositions);
        
        const {
          a: A,
          b: B,
          c: C,
          d: D,
          e: E,
          f: F,
        } = this.ellipseFit.conic.equation;
        
        const q = (64 * (F*(4*A*C - B**2) - (A*E**2) + (B*D*E) - (C*D**2))) / (4*A*C - B**2)**2;
        const s = 0.25 * Math.sqrt(Math.abs(q)*Math.sqrt(B**2 + (A - C)**2));
        
        this.ellipseFit.a = 0.125 * Math.sqrt(2*Math.abs(q)*Math.sqrt(B**2 + (A - C)**2) - 2*q*(A + C));
        this.ellipseFit.b = Math.sqrt(this.ellipseFit.a**2 - s**2);
        this.ellipseFit.h = (B*E - 2*D*C) / (4*A*C - B**2);
        this.ellipseFit.k = (B*D - 2*A*E) / (4*A*C - B**2);
        
        const qAqC = q*A - q*C;
        const qB = q*B;
        let theta;
        
        if (approxEquals(qAqC, 0, EPSILON) && approxEquals(qB, 0, EPSILON))
          theta = 0;
        else if (approxEquals(qAqC, 0, EPSILON) && qB > 0)
          theta = 0.25*Math.PI;
        else if (approxEquals(qAqC, 0, EPSILON) && qB < 0)
          theta = 0.75*Math.PI;
        else if (qAqC > 0 && qB >= 0)
          theta = 0.5*Math.atan(B / (A - C));
        else if (qAqC > 0 && qB < 0)
          theta = 0.5*Math.atan(B / (A - C)) + Math.PI;
        else if (qAqC < 0)
          theta = 0.5*Math.atan(B / (A - C)) + 0.5*Math.PI;
        
        this.ellipseFit.theta = theta;
        this.ellipseFit.eccentricity = Math.sqrt(1 - (this.ellipseFit.b**2 / this.ellipseFit.a**2));
        
        console.log(`Period ~ sqrt(a^3): ${this._period}\t${Math.sqrt(this.ellipseFit.a**3)}`);
        
        this.intervalAreas.length = 0;
        this._orbitalIntervals.length = 0;
        
        for (let i = 0; i < 10; i++) {
          const idx = Math.floor(Math.random()*(this._orbitalPositions.length))
          const intervalPoints = this._orbitalPositions.slice(idx, idx+2);
          const intervalBoundary = [
            intervalPoints[0],
            intervalPoints[lastIdx(intervalPoints)],
          ];
          if (intervalBoundary.every(point => point !== undefined)) {
            this._orbitalIntervals.push(intervalBoundary);
            this.intervalAreas.push(triangleArea(this.star.position, ...intervalBoundary));
          }
        }
        
        this._orbitalPositions.length = 0;
      }
    }
  }
})();