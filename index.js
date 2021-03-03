/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Grid from "./grid";

const g = new Grid(0, 10, -10, 10);
register("renderOverlay", () => {
  if (g.gui.isOpen()) {
    g.draw(false, true);
    g.graph("sin(x)*x^2", Renderer.BLUE);
    // g.graph("sin(x)", Renderer.AQUA);
  }
});

register("command", () => {
  g.gui.open();
}).setName("graph");