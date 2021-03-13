import * as Elementa from "Elementa/index";
import { Formula } from "../fparser";
import { createNewInput, getInput } from "./equationBlocks";
const Color = Java.type("java.awt.Color");

export default class Grid {
  constructor() {
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

    this.gridBackground = new Elementa.UIBlock(new Color(0.7, 0.7, 0.7))
      .setX(new Elementa.CenterConstraint())
      .setY(new Elementa.CenterConstraint())
      .setWidth(new Elementa.PixelConstraint(this.width))
      .setHeight(new Elementa.PixelConstraint(this.height));

    this.gui = new Gui();

    this.xMin = -10;
    this.xMax = 10;
    this.yMin = -10;
    this.yMax = 10;

    this.xOffset = MathLib.map(0, this.xMin, this.xMax, this.left, this.right);
    this.yOffset = MathLib.map(0, this.yMin, this.yMax, this.bottom, this.top);

    this.xStep = this.width / (this.xMax - this.xMin);
    this.yStep = this.height / (this.yMax - this.yMin);
    this.xTicks = [];
    this.yTicks = [];
    this.lines = [];

    this.inputBackground = createNewInput().setY(new Elementa.CenterConstraint());
    this.equationInput = getInput(this.inputBackground);

    this.inputContainer = new Elementa.UIContainer()
      .setX(new Elementa.PixelConstraint(10, false))
      .setY(new Elementa.CenterConstraint())
      .setWidth(new Elementa.RelativeConstraint())
      .setHeight(new Elementa.ChildBasedMaxSizeConstraint())
      .addChild(this.inputBackground);

    this.window = new Elementa.Window()
      .addChildren(
        this.gridBackground,
        this.inputContainer
      );

    this.graphing = false;

    this.text = new Display()
      .setTextColor(Renderer.BLUE)
      .setBackgroundColor(Renderer.color(25, 25, 25, 100))
      .setBackground(DisplayHandler.Background.FULL);

    this.gui.registerKeyTyped((char, key) => {
      this.window.keyType(char, key);

      switch (key) {
        case Keyboard.KEY_RETURN:
          this.graphing = true;
          this.recalculatePoints();
          this.text.setShouldRender(true);
          createNewInput();
          break;
        case Keyboard.KEY_DELETE:
          this.equationInput.setText("");
        default:
          this.graphing = false;
          this.lines = [];
          this.text.setShouldRender(false);
          break;
      }
    });

    this.gui.registerScrolled((mx, my, dir) => { // 1 is zoom in, -1 zoom out
      // plan on adding zoom capability
      switch (dir) {
        case -1:
          this.xMin *= 1.25;
          this.xMax *= 1.25;
          this.yMin *= 1.25;
          this.yMax *= 1.25;
          break;
        case 1:
          this.xMin *= .8;
          this.xMax *= .8;
          this.yMin *= .8;
          this.yMax *= .8;
          break;
      }
      this.xStep = this.width / (this.xMax - this.xMin);
      this.yStep = this.height / (this.yMax - this.yMin);
      this.xOffset = MathLib.map(0, this.xMin, this.xMax, this.left, this.right);
      this.yOffset = MathLib.map(0, this.yMin, this.yMax, this.bottom, this.top);

      this.recalculatePoints();
      this.recalculateTicks();
    });

    // move to own functions please this hurts my eyes
    this.gui.registerDraw((mx, my, pt) => {
      if (!this.lines.length || !this.graphing) return;
      const val = MathLib.map(mx, this.left, this.right, this.xMin, this.xMax);
      const closest = this.lines.reduce((a, b) => {
        return Math.abs(b.mathX - val) < Math.abs(a.x - val)
          ? { x: b.mathX, y: b.mathY }
          : { x: a.x, y: a.y };
      });
      this.text
        .setLine(0, `(${closest.x.toFixed(3)}, ${closest.y.toFixed(3)})`)
        .setRenderLoc(
          MathLib.clamp(
            this.graphCoordsToScreenCoords(closest.x, closest.y).x,
            this.left,
            this.right
          ),
          MathLib.clamp(
            this.graphCoordsToScreenCoords(closest.x, closest.y).y + 10,
            this.top,
            this.bottom + 10
          )
        );
      Renderer.drawCircle(
        Renderer.GOLD,
        this.graphCoordsToScreenCoords(closest.x, closest.y).x,
        this.graphCoordsToScreenCoords(closest.x, closest.y).y,
        3,
        10
      );
    });

    this.gui.registerClicked((mx, my, btn) => {
      this.graphing = false;
      this.setAllInactive(this.window);
      this.window.mouseClick(mx, my, btn);
    });
  }

  open() {
    this.gui.open();
    this.drawAxes();
    this.recalculateTicks();
  }

  setAllInactive(comp) {
    if (comp.children.length) comp.children.forEach(child => this.setAllInactive(child));
    if (comp instanceof Elementa.UITextInput) comp.setActive(false);
  }

  drawAxes() {
    if (this.xMin <= 0 && this.xMax >= 0) { // draw y axis
      Renderer.drawLine(Renderer.RED, this.xOffset, this.top, this.xOffset, this.bottom, 1);
    }
    if (this.yMin <= 0 && this.yMax >= 0) { // draw x axis
      Renderer.drawLine(Renderer.RED, this.left, this.yOffset, this.right, this.yOffset, 1);
    }

    this.xTicks.forEach(x => {
      Renderer.drawLine(Renderer.BLACK, x, this.yOffset - 2, x, this.yOffset + 2, 1);
    });
    this.yTicks.forEach(y => {
      Renderer.drawLine(Renderer.BLACK, this.xOffset - 2, y, this.xOffset + 2, y, 1);
    });
  }

  draw() {
    this.window.draw();
    this.drawAxes();
    this.graph(Renderer.AQUA);
  }

  recalculateTicks() {
    this.yTicks = [];
    this.xTicks = [];
    if (this.yStep > 7) {
      for (let y = this.yOffset; y >= this.top; y -= this.yStep) { // ticks across y axis (0, inf)
        this.yTicks.push(y);
      }
      for (let y = this.yOffset; y <= this.bottom; y += this.yStep) { // ticks across y axis (-inf, 0)
        this.yTicks.push(y);
      }
    }

    if (this.xStep > 7) {
      for (let x = this.xOffset; x <= this.right; x += this.xStep) { // ticks across x axis (0, inf)
        this.xTicks.push(x);
      }
      for (let x = this.xOffset; x >= this.left; x -= this.xStep) { // ticks across x axis (-inf, 0)
        this.xTicks.push(x);
      }
    }
  }

  recalculatePoints() {
    this.lines = [];
    /**
     * This algorithm was heavily influenced by 
     * https://www.youtube.com/watch?v=E-_Lc6FrDRw
     */
    try {
      this.parser = new Formula(this.equationInput.getText());
      this.lines = [];

      for (let i = 0; i < this.width; i++) {
        let percentX = i / (this.width - 1);
        let mathX = percentX * (this.xMax - this.xMin) + this.xMin;

        let mathY = this.parser.evaluate({ x: mathX });

        let percentY = (mathY - this.yMin) / (this.yMax - this.yMin);
        let x = this.left + percentX * this.width;
        let y = this.bottom - percentY * this.height;

        this.lines.push({ x, y, mathX, mathY });
      }
    } catch (e) { }
  }

  graph(color) {
    if (!this.graphing) return;

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

  graphCoordsToScreenCoords(x, y) {
    const percentX = (x - this.xMin) / (this.xMax - this.xMin);
    const percentY = (y - this.yMin) / (this.yMax - this.yMin);
    const outX = this.left + percentX * this.width;
    const outY = this.bottom - percentY * this.height;
    return { x: outX, y: outY };
  }
}