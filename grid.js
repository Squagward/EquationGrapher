import Formula from "../fparser";

export default class Grid {
  constructor(xMin, xMax, yMin, yMax) {
    this.center = {
      x: Renderer.screen.getWidth() / 2,
      y: Renderer.screen.getHeight() / 2
    };
    this.radius = 150; // 300 px wide

    this.left = this.center.x - this.radius;
    this.right = this.center.x + this.radius;
    this.top = this.center.y - this.radius;
    this.bottom = this.center.y + this.radius;

    this.width = this.right - this.left;
    this.height = this.bottom - this.top;

    this.background = new Rectangle(Renderer.color(200, 200, 200), this.left, this.top, this.width, this.height);
    this.gui = new Gui();

    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.steps = 300;

    this.xStep = this.width / (this.xMax - this.xMin);
    this.yStep = this.height / (this.yMax - this.yMin);
  }

  #drawGrid(xStep, yStep) {
    this.background.draw();

    if (xStep) {
      for (let x = this.left; x <= this.right; x += xStep) {
        Renderer.drawLine(Renderer.BLACK, x, this.top, x, this.bottom, 1);
      }
    }

    if (yStep) {
      for (let y = this.top; y <= this.bottom; y += yStep) {
        Renderer.drawLine(Renderer.BLACK, this.left, y, this.right, y, 1);
      }
    }
  }

  #drawAxes() {
    if (this.xMin <= 0 && this.xMax >= 0) { // draw y axis
      const xOffset = this.left + (0 - this.xMin) * this.xStep;
      Renderer.drawLine(Renderer.RED, xOffset, this.top, xOffset, this.bottom, 1);
    }
    if (this.yMin <= 0 && this.yMax >= 0) { // draw x axis
      const yOffset = this.bottom - (0 - this.yMin) * this.yStep;
      Renderer.drawLine(Renderer.RED, this.left, yOffset, this.right, yOffset, 1);
    }
  }

  draw(axes = true) {
    this.#drawGrid(this.xStep, this.yStep);
    if (axes) this.#drawAxes();
  }

  graph(eq, color) {
    /**
     * This algorithm was heavily influenced by 
     * https://www.youtube.com/watch?v=E-_Lc6FrDRw
     */
    const parsed = new Formula(eq);
    this.lines = [];

    for (let i = 0; i < this.steps; i++) {
      let percentX = i / (this.steps - 1);
      let mathX = percentX * (this.xMax - this.xMin) + this.xMin;

      let mathY = parsed.evaluate({ x: mathX });

      let percentY = (mathY - this.yMin) / (this.yMax - this.yMin);
      let x = this.left + percentX * this.width;
      let y = this.bottom - percentY * this.height;

      this.lines.push({ x, y });
    }

    for (let i = 0; i < this.lines.length - 1; i++) {
      Renderer.drawLine(
        color,
        this.lines[i].x,
        this.lines[i].y,
        this.lines[i + 1].x,
        this.lines[i + 1].y,
        2
      );
    }
  }
}