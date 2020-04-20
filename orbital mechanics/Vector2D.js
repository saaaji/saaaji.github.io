class Vector2D {
  
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  
  clone() {
    return new Vector2D(this.x, this.y);
  }
  
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  
  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
  }
  
  subtractScaledVector(v, s) {
    this.x -= v.x * s;
    this.y -= v.y * s;
  }
  
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  
  distanceTo(v) {
    return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2);
  }
  
  distanceToSquared(v) {
    return (this.x - v.x)**2 + (this.y - v.y)**2;
  }
  
  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  
  normalize() {
    return this.scale(1 / this.magnitude);
  }
  
  log(name) {
    console.log(`${name}: (${this.x}, ${this.y})`);
  }
  
  clamp(min, max) {
    this.x = Math.min(Math.max(min, this.x), max);
    this.y = Math.min(Math.max(min, this.y), max);
    return this;
  }
  
  get magnitude() {
    return Math.sqrt(this.x**2 + this.y**2);
  }
  
}