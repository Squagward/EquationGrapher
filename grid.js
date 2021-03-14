import * as Elementa from "Elementa/index";
import { Formula } from "../fparser";
import { createNewInput, getInput } from "./equationBlocks";
import { addTableRow, clearTable, deleteRow, generateBlock, setRowValue } from "./table";
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

    // default zoom
    this.xMin = -10;
    this.xMax = 10;
    this.yMin = -10;
    this.yMax = 10;

    // get axes at correct locations
    this.xOffset = MathLib.map(0, this.xMin, this.xMax, this.left, this.right);
    this.yOffset = MathLib.map(0, this.yMin, this.yMax, this.bottom, this.top);

    // screen increase per tick
    this.xStep = this.width / (this.xMax - this.xMin);
    this.yStep = this.height / (this.yMax - this.yMin);
    this.xTicks = [];
    this.yTicks = [];

    // array of all the equation lines
    this.lines = [];

    // creating a background to put in equations
    this.inputBackground = createNewInput().setY(new Elementa.CenterConstraint());
    this.equationInput = getInput(this.inputBackground);

    // container holding all of the equation inputs & backgrounds
    this.inputContainer = new Elementa.UIContainer()
      .setX(new Elementa.PixelConstraint(10, false))
      .setY(new Elementa.CenterConstraint())
      .setWidth(new Elementa.RelativeConstraint())
      .setHeight(new Elementa.ChildBasedMaxSizeConstraint())
      .addChild(this.inputBackground);

    // table of x, y1, y2 etc values
    this.table = generateBlock();
    // add x row first
    addTableRow(this.table, 0, new Color(0, 0, 0));

    this.window = new Elementa.Window()
      .addChildren(
        this.gridBackground,
        this.inputContainer,
        this.table
      );

    this.graphing = false;

    this.gui.registerKeyTyped((char, key) => {
      this.window.keyType(char, key);

      switch (key) {
        case Keyboard.KEY_RETURN: {
          this.graphing = true;
          if (this.table.children.length > this.lines.length) {
            const [r, g, b] = this.calculatePoints();
            addTableRow(
              this.table,
              `Y${this.table.children.length}`,
              new Color(r / 255, g / 255, b / 255)
            );
          }
          break;
        }
        case Keyboard.KEY_DOWN: { // add button to add and delete graphs plssss
          this.inputContainer.addChild(createNewInput());
          break;
        }
        case Keyboard.KEY_DELETE: {
          this.equationInput.setText("");
          clearTable(this.table);
        }
        default: {
          // stop graphing if any other key is pressed
          this.graphing = false;
          this.lines = [];
          break;
        }
      }
    });

    this.gui.registerDraw((mx, my, pt) => {
      // convert mouse x value to graph value
      const mappedX = MathLib.clampFloat(
        MathLib.map(mx, this.left, this.right, this.xMin, this.xMax),
        this.xMin,
        this.xMax
      );

      // update the x row on the table
      setRowValue(this.table, 0, "X", mappedX.toFixed(3));

      this.table.children.forEach((child, index) => {
        if (index === 0) return;

        const [vals,] = this.lines[index - 1]; // causing issues REEEE
        //org.mozilla.javascript.EcmaError: TypeError: Cannot read property "0" from undefined (file:/grid.js#122)

        const closest = vals.reduce((a, b) => {
          return Math.abs(b.mathX - mappedX) < Math.abs(a.x - mappedX)
            ? { x: b.mathX, y: b.mathY }
            : { x: a.x, y: a.y };
        });

        Renderer.drawCircle(
          Renderer.DARK_PURPLE,
          this.graphToScreenCoords(closest.x).x,
          this.graphToScreenCoords(closest.y).y,
          3,
          10
        );
        setRowValue(this.table, index, `Y${index}`, closest.y.toFixed(3));
      });
    });

    this.gui.registerScrolled((mx, my, dir) => {
      switch (dir) {
        case -1:
          this.xMin *= 1.2;
          this.xMax *= 1.2;
          this.yMin *= 1.2;
          this.yMax *= 1.2;
          break;
        case 1:
          this.xMin *= 5 / 6;
          this.xMax *= 5 / 6;
          this.yMin *= 5 / 6;
          this.yMax *= 5 / 6;
          break;
      }
      this.xStep = this.width / (this.xMax - this.xMin);
      this.yStep = this.height / (this.yMax - this.yMin);
      this.xOffset = MathLib.map(0, this.xMin, this.xMax, this.left, this.right);
      this.yOffset = MathLib.map(0, this.yMin, this.yMax, this.bottom, this.top);

      this.recalculatePoints();
      this.recalculateTicks();
    });

    this.gui.registerClicked((mx, my, btn) => {
      this.setAllInactive(this.window);
      this.window.mouseClick(mx, my, btn);
    });
  }

  open() {
    this.gui.open();
    this.drawAxes();
    this.recalculateTicks();
    if (this.graphing) this.graph();
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
    this.graph();
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

  /**
   * Called only when the user presses enter.
   * @returns {number[]} colors used for table text color
   */
  calculatePoints() {
    this.lines = [];
    /**
     * This algorithm was heavily influenced by 
     * https://www.youtube.com/watch?v=E-_Lc6FrDRw
     */

    for (let child of this.inputContainer.children) { // loop through every array of points
      let input = getInput(child);
      this.parser = new Formula(input.getText());

      let tempLine = [];

      for (let i = 0; i < this.width; i++) {
        let percentX = i / (this.width - 1);
        let mathX = percentX * (this.xMax - this.xMin) + this.xMin;

        let mathY = this.parser.evaluate({ x: mathX });

        let percentY = (mathY - this.yMin) / (this.yMax - this.yMin);
        let x = this.left + percentX * this.width;
        let y = this.bottom - percentY * this.height;

        tempLine.push({ x, y, mathX, mathY }); // add the point to the tempLine
      }

      let color = this.assignColor();
      this.lines.push([tempLine, Renderer.color(color.r, color.g, color.b)]); // assign a random color
      return color;
    }
  }

  /**
   * Called whenever the user scrolls. Needs to be a separate function
   * in order to not have rapid color changing lines
   */
  recalculatePoints() {
    let colors = this.lines.map(([l, c]) => c); // grab the colors for each line then remove lines
    this.lines = [];

    // rebuild the lines
    for (let i = 0; i < this.inputContainer.children.length; i++) {
      let child = this.inputContainer.children[i];
      let input = getInput(child);
      this.parser = new Formula(input.getText());

      let tempLine = [];

      for (let i = 0; i < this.width; i++) {
        let percentX = i / (this.width - 1);
        let mathX = percentX * (this.xMax - this.xMin) + this.xMin;

        let mathY = this.parser.evaluate({ x: mathX });

        let percentY = (mathY - this.yMin) / (this.yMax - this.yMin);
        let x = this.left + percentX * this.width;
        let y = this.bottom - percentY * this.height;

        tempLine.push({ x, y, mathX, mathY });
      }
      this.lines.push([tempLine, colors[i]]); // assign the color that was there previously
    }
  }

  graph() {
    if (!this.graphing) return;
    for ([line, color] of this.lines) { // loop through each line on the graph
      for (let i = 0; i < line.length - 1; i++) {
        if (
          line[i].y >= this.top &&      // Checking to make sure the
          line[i].y <= this.bottom &&   // point is in the bounds
          line[i + 1].y >= this.top &&  // of the screen.
          line[i + 1].y <= this.bottom
        )
          Renderer.drawLine(
            color,
            line[i].x,
            line[i].y,
            line[i + 1].x,
            line[i + 1].y,
            2
          );
      }
    }
  }

  assignColor() {
    let r = Math.random() * 255;
    let g = Math.random() * 255;
    let b = Math.random() * 255;
    return { r, g, b };
  }

  graphToScreenCoords(x, y) {
    const percentX = (x - this.xMin) / (this.xMax - this.xMin);
    const percentY = (y - this.yMin) / (this.yMax - this.yMin);
    const outX = this.left + percentX * this.width;
    const outY = this.bottom - percentY * this.height;
    return { x: outX, y: outY };
  }
}