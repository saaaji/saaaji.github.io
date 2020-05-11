import * as vec2 from './vec2.js';

// constants
const GRAVITATIONAL_CONSTANT = 6.67e-11;

// unit conversion factors
const AU_TO_PX = 200, // astronomical units to screen pixels
      M_TO_AU = 6.68459e-12, // meters to astronomical units
      M_TO_PX = M_TO_AU * AU_TO_PX, // meters to screen pixels
      S_TO_DAYS = 1 / (60 * 60 * 24); // seconds to days

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
    
    // plotting parameters
    this.plotSettings = {
      backgroundColor: 'rgb(20, 20, 20)',
    };
  }
  get worldTime() {
    return this._worldTime;
  }
  get period() {
    return this._period;
  }
  plot() {
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.fillStyle = this.plotSettings.backgroundColor;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.setTransform(1, 0, 0, 1, this._canvas.width * 0.5, this._canvas.height * 0.5);
    
    this.planet.plot(this._ctx, M_TO_PX);
    this.star.plot(this._ctx, M_TO_PX);
  }
}

TwoBodySystem.prototype.updateGravitationalAcceleration = (() => {
  const planetToStar = vec2.create(),
        starToPlanet = vec2.create(),
        gravityOnPlanet = vec2.create(),
        gravityOnStar = vec2.create();
  
  return function updateGravitationalAcceleration() {
    vec2.sub(planetToStar, this.star.pos, this.planet.pos);
    vec2.norm(planetToStar, planetToStar);
    vec2.negate(starToPlanet, planetToStar);
    
    const distance = vec2.distanceTo(this.planet.pos, this.star.pos);
    const gravityMagnitude = GRAVITATIONAL_CONSTANT * this.planet.mass * this.star.mass / (distance**2 + Number.EPSILON);
    
    vec2.scale(gravityOnPlanet, planetToStar, gravityMagnitude);
    vec2.scale(gravityOnStar, starToPlanet, gravityMagnitude);
    
    vec2.scale(this.planet.accel, gravityOnPlanet, 1 / this.planet.mass);
    vec2.scale(this.star.accel, gravityOnStar, 1 / this.star.mass);
  }
})();

TwoBodySystem.prototype.update = (() => {
  const planetToStar = vec2.create();
  
  return function update() {
    for (let i = 0; i < this.stepsPerUpdate; i++) {
      this._worldTime += this.timeStep;
      
      this.updateGravitationalAcceleration();
      this.planet.update(this.timeStep);
      this.star.update(this.timeStep);
      
      vec2.sub(planetToStar, this.star.pos, this.planet.pos);
      this._previousPreviousAngle = this._previousAngle;
      this._previousAngle = this._currentAngle;
      this._currentAngle = Math.atan2(planetToStar[1], planetToStar[0]);
      
      this._previousTime = this._currentTime;
      this._currentTime = this._worldTime;
      
      if (this._previousAngle < this._previousPreviousAngle &&
          this._previousAngle < this._currentAngle) {
        this._period = this._previousTime - this._previousPeriodOcurrence;
        this._previousPeriodOcurrence = this._previousTime;
        console.log(`Period: ${this._period * S_TO_DAYS}`);
      }
    }
  }
})();