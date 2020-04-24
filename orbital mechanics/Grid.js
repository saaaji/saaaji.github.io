class Grid {
  
  constructor({
    cellSize,
    backgroundColor,
    minorGridColor,
    majorGridColor,
    fontName,
    fontSize,
    fontColor,
    fontPadding,
    minorGridLineWidth,
    majorGridSize,
    majorGridLineWidth,
    drawMinorGrid,
    canvas,
    ctx,
  }) {
    
    // drawing
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawMinorGrid = drawMinorGrid;
    
    // sizing
    this.cellSize = cellSize;
    this.majorGridSize = majorGridSize;
    
    // styling
    this.backgroundColor = backgroundColor;
    this.minorGridColor = minorGridColor;
    this.majorGridColor = majorGridColor;
    
    this.minorGridLineWidth = minorGridLineWidth;
    this.majorGridLineWidth = majorGridLineWidth;
    
    this.fontName = fontName;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.fontPadding = fontPadding;
    
  }
  
  draw(scale) {
    
    // draw grid background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    
    // initialize display parameters
    let displaySize = this.cellSize * scale;
    let displayScale = 1;
    
    // resize display vars
    if (displaySize > this.cellSize * 2) {
      while (displaySize > this.cellSize * 2) {
        displaySize *= 0.5;
        displayScale *= 0.5;
      }
    } else if (displaySize < this.cellSize * 0.5) {
      while (displaySize < this.cellSize * 0.5) {
        displaySize *= 2;
        displayScale *= 2;
      }
    }
    
    
  //console.log('true');
    
    //console.log(displaySize);
    
    // setup
    let x, y, labelText, xMax = 0, yMax = 0;
    
    if (this.drawMinorGrid) {
      while ((xMax++) * displaySize < this.canvas.width * 0.5);
      xMax++;
      
      while ((yMax++) * displaySize < this.canvas.height * 0.5)
      yMax++;
      
      // draw individual grid cells
      this.ctx.lineWidth = this.minorGridLineWidth;
      this.ctx.strokeStyle = this.minorGridColor;
      for (x = 0; x < xMax; x++) {
        for (y = 0; y < yMax; y++) {
          this.ctx.strokeRect(+x * displaySize, +y * displaySize, displaySize, displaySize);
          this.ctx.strokeRect((x + 1) * -displaySize, (y + 1) * -displaySize, displaySize, displaySize);
          this.ctx.strokeRect((x + 1) * -displaySize, +y * displaySize, displaySize, displaySize);
          this.ctx.strokeRect(+x * displaySize, (y + 1) * -displaySize, displaySize, displaySize);
        }
      }
    }
    
    // setup
    xMax = 0;
    yMax = 0;
    
    while ((xMax += this.majorGridSize) * displaySize < this.canvas.width * 0.5);
    xMax += this.majorGridSize;
    
    while ((yMax += this.majorGridSize) * displaySize < this.canvas.height * 0.5)
    yMax += this.majorGridSize;
    
    // set up font styles
    this.ctx.fillStyle = this.fontColor;
    this.ctx.font = `${this.fontSize}px ${this.fontName}`;
    
    // draw large grid cells and axis labels
    this.ctx.lineWidth = this.majorGridLineWidth;
    this.ctx.strokeStyle = this.majorGridColor;
    for (x = 0; x < xMax; x += this.majorGridSize) {
      for (y = 0; y < yMax; y += this.majorGridSize) {
        
        this.ctx.strokeRect(+x * displaySize, +y * displaySize, displaySize * this.majorGridSize, displaySize * this.majorGridSize);
        this.ctx.strokeRect((x + this.majorGridSize) * -displaySize, (y + this.majorGridSize) * -displaySize, displaySize * this.majorGridSize, displaySize * this.majorGridSize);
        this.ctx.strokeRect((x + this.majorGridSize) * -displaySize, +y * displaySize, displaySize * this.majorGridSize, displaySize * this.majorGridSize);
        this.ctx.strokeRect(+x * displaySize, (y + this.majorGridSize) * -displaySize, displaySize * this.majorGridSize, displaySize * this.majorGridSize);
        
        // draw Y label
        if (x === 0) {
          labelText = (y * displayScale).toString();
          if (labelText.length > 5) {
            labelText = (y * displayScale).toExponential(2);
          }
        
          this.ctx.fillText(labelText, x * displaySize + this.fontPadding, y * displaySize + this.fontSize + this.fontPadding);
          if (y !== 0) {
            this.ctx.fillText('-' + labelText, x * displaySize + this.fontPadding, -y * displaySize + this.fontSize + this.fontPadding);
          }
        }
        
        // draw X label
        if (y === 0) {
          labelText = (x * displayScale).toString();
          if (labelText.length > 5) {
            labelText = (x * displayScale).toExponential(2);
          }
        
          this.ctx.fillText(labelText, x * displaySize + this.fontPadding, y * displaySize + this.fontSize + this.fontPadding);
          if (x !== 0) {
            this.ctx.fillText('-' + labelText, -x * displaySize + this.fontPadding, -y * displaySize + this.fontSize + this.fontPadding);
          }
        }
        
      }
    }
    
  }
  
}