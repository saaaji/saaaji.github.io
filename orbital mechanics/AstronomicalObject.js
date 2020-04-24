class AstronomicalObject {
  
  constructor(mass, radius, color, name) {
    this.position = new Vector2D();
    this.velocity = new Vector2D();
    this.acceleration = new Vector2D();
    this.mass = mass;
    this.radius = radius;
    this.color = color;
    this.name = name;
  }
  
  draw(ctx, scale, drawLabel) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.position.x * scale,
      this.position.y * scale,
      this.radius,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    
    if (drawLabel) {
      ctx.fillStyle = this.constructor.fontColor;
      ctx.font = `${this.constructor.fontSize}px ${this.constructor.fontName}`;
    
      ctx.fillText(
        this.name,
        this.position.x * scale + this.radius,
        this.position.y * scale + this.radius + this.constructor.fontSize,
      );
    }
  }
}

Object.assign(AstronomicalObject, {
  fontName: '"Roboto", monospace',
  fontSize: 15,
  fontColor: 'rgb(250, 250, 250)',
});