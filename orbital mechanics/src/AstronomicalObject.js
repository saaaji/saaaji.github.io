import * as vec2 from './vec2.js';

const PI_2 = 2 * Math.PI;

export default class AstronomicalObject {
  constructor({mass, name, color, pathColor, radius}) {
    this.mass = mass;
    this.position = vec2.create();
    this.velocity = vec2.create();
    this.acceleration = vec2.create();
    this._savedPositions = [];
    
    // visual properties
    this.name = name;
    this.radius = radius;
    this.color = color;
    this.pathColor = pathColor;
  }
  update(timeStep) {
    vec2.addScaled(this.velocity, this.velocity, this.acceleration, timeStep);
    vec2.addScaled(this.position, this.position, this.velocity, timeStep);
  }
  savePosition() {
    this._savedPositions.push(vec2.clone(this.position));
    if (this._savedPositions.length > 2000) {
      this._savedPositions = this._savedPositions.slice(200);
    }
  }
  plotPath(ctx, scale) {
    ctx.strokeStyle = this.pathColor;
    ctx.beginPath();
    for (let i = 0; i < this._savedPositions.length; i++) {
      ctx.lineTo(
        this._savedPositions[i][0] * scale,
        this._savedPositions[i][1] * scale,
      );
    }
    ctx.stroke();
  }
  plot(ctx, scale) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.position[0] * scale,
      this.position[1] * scale,
      this.radius,
      0,
      PI_2
    );
    ctx.fill();
  }
}