import * as vec2 from './vec2.js';

const PI_2 = 2 * Math.PI;

export default class AstronomicalObject {
  constructor({mass, name, color, radius}) {
    
    // visual properties
    this.name = name;
    this.color = color;
    this.radius = radius;
    
    // mass
    this.mass = mass;
    
    // position, velocity, and acceleration
    this.pos = vec2.create();
    this.vel = vec2.create();
    this.accel = vec2.create();
  }
  update(timeStep) {
    vec2.addScaled(this.vel, this.vel, this.accel, timeStep);
    vec2.addScaled(this.pos, this.pos, this.vel, timeStep);
  }
  plot(ctx, scale) {
    const x = this.pos[0] * scale,
          y = this.pos[1] * scale;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, PI_2);
    ctx.fill();
    
    ctx.font = `${this.constructor.plotSettings.fontSize}px ${this.constructor.plotSettings.fontFamily}`;
    ctx.fillStyle = this.constructor.plotSettings.fontColor;
    ctx.fillText(this.name, x + this.radius, y + this.radius + this.constructor.plotSettings.fontSize);
  }
}

AstronomicalObject.plotSettings = {
  fontSize: 15,
  fontFamily: '"Roboto", sans-serif',
  fontColor: 'white',
};