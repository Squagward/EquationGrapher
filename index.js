/// <reference types="../CTAutocomplete" />
/// <reference types="../Elementa" />
/// <reference lib="es2015" />

import Grid from "./grid";
import { Formula } from "../fparser";

const g = new Grid();
register("renderOverlay", () => {
  if (g.gui.isOpen()) {
    g.draw();
  }
});

register("command", () => {
  g.open();
}).setName("graph");

// add ln and log
Formula.addMappings({
  "ln": "log",
  "log": "log10"
});