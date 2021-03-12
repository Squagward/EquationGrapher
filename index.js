/// <reference types="../CTAutocomplete" />
/// <reference types="./depTypes" />
/// <reference lib="es2015" />

import Grid from "./grid";

const g = new Grid();
register("renderOverlay", () => {
  if (g.gui.isOpen()) {
    g.draw();
  }
});

register("command", () => {
  g.open();
}).setName("graph");

const d = new Display()
  .setRenderLoc(50, 50);
register("tick", ticks => {
  if (ticks % 2 === 0) return;
  d.setLine(0, `${Client.getFPS()} fps`);
});