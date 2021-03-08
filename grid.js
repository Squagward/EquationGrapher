import * as Elementa from "Elementa/index";
import { Formula } from "../fparser";
const Color = java.awt.Color;

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

    this.background = new Elementa.UIBlock(new Color(0.7, 0.7, 0.7))
      .setX(new Elementa.CenterConstraint())
      .setY(new Elementa.CenterConstraint())
      .setWidth(new Elementa.PixelConstraint(this.width))
      .setHeight(new Elementa.PixelConstraint(this.height));

    this.gui = new Gui();

    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.steps = 1000;

    this.xStep = this.width / (this.xMax - this.xMin);
    this.yStep = this.height / (this.yMax - this.yMin);


    this.input = new Elementa.UITextInput("")
      .setX(new Elementa.PixelConstraint(3, false))
      .setY(new Elementa.CenterConstraint())
      .setWidth(new Elementa.PixelConstraint(100, false))
      .setHeight(new Elementa.PixelConstraint(20, false));

    this.inputBackground = new Elementa.UIRoundedRectangle(2)
      .setColor(new Elementa.ConstantColorConstraint(new Color(0.1, 0.1, 0.1, 1)))
      .setX(new Elementa.PixelConstraint(10, false))
      .setY(new Elementa.PixelConstraint(this.center.y - this.input.getHeight() / 2 - 3, false)) // 3 margin
      .setWidth(new Elementa.AdditiveConstraint(
        new Elementa.ChildBasedMaxSizeConstraint(), new Elementa.PixelConstraint(6, false)
      ))
      .setHeight(new Elementa.AdditiveConstraint(
        new Elementa.ChildBasedSizeConstraint(), new Elementa.PixelConstraint(6, false)
      ))
      .addChild(this.input);

    this.window = new Elementa.Window()
      .addChildren(
        this.background,
        this.inputBackground
      );

    this.gui.registerDraw((x, y) => this.draw());
    this.gui.registerClicked((x, y, b) => this.window.mouseClick(x, y, b));
    this.gui.registerMouseDragged((x, y, b) => this.window.mouseDrag(x, y, b));
    this.gui.registerScrolled((x, y, s) => this.window.mouseScroll(s));
    this.gui.registerMouseReleased((x, y, b) => this.window.mouseRelease());
    this.gui.registerKeyTyped((char, key) => this.window.keyType(char, key));
  }

  open() {
    this.gui.open();
    this.input.setActive(true);
  }

  #drawTicks(xStep, yStep) {
    for (let x = this.left; x <= this.right; x += xStep) {
      Renderer.drawLine(Renderer.BLACK, x, this.center.y - 2, x, this.center.y + 2, 1);
    }
    for (let y = this.top; y <= this.bottom; y += yStep) {
      Renderer.drawLine(Renderer.BLACK, this.center.x - 2, y, this.center.x + 2, y, 1);
    }
  }

  #drawAxes() {
    if (this.xMin <= 0 && this.xMax >= 0) { // draw y axis
      const xOffset = this.left + (-this.xMin) * this.xStep;
      Renderer.drawLine(Renderer.RED, xOffset, this.top, xOffset, this.bottom, 1);
    }
    if (this.yMin <= 0 && this.yMax >= 0) { // draw x axis
      const yOffset = this.bottom - (-this.yMin) * this.yStep;
      Renderer.drawLine(Renderer.RED, this.left, yOffset, this.right, yOffset, 1);
    }
  }

  draw() {
    this.window.draw();
    this.#drawAxes();
    this.#drawTicks(this.xStep, this.yStep);
    this.graph(Renderer.AQUA);
  }

  graph(color) {
    /**
     * This algorithm was heavily influenced by 
     * https://www.youtube.com/watch?v=E-_Lc6FrDRw
     */
    try {
      const parsed = new Formula(this.input.getText());
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
        if (
          this.lines[i].y >= this.top &&
          this.lines[i].y <= this.bottom &&
          this.lines[i + 1].y >= this.top &&
          this.lines[i + 1].y <= this.bottom
        )
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
    catch (e) { }
  }
}