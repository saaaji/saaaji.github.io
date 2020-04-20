class AstronomicalObject {
  
  constructor(mass, radius, color) {
    this.position = new Vector2D();
    this.velocity = new Vector2D();
    this.acceleration = new Vector2D();
    this.mass = mass;
    this.radius = radius;
    this.color = color;
  }
  
  draw(ctx) {
    //ctx.fillStyle = 'white';
    //ctx.fillRect(this.position.x, this.position.y, 10, 10);
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    //ctx.moveTo(this.position.x, this.position.y);
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
    ctx.fill();
  }
  
}