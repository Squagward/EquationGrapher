import { UITextInput } from "Elementa/index";

const setAllInactive = comp => {
  if (comp.children.length) comp.children.forEach(child => this.setAllInactive(child));
  if (comp instanceof UITextInput) comp.active = false;
};

const firstBorn = comp => comp.children[0];

const assignColor = () => {
  let r = Math.random() * 255;
  let g = Math.random() * 255;
  let b = Math.random() * 255;
  return { r, g, b };
};

export {
  setAllInactive,
  firstBorn,
  assignColor
};