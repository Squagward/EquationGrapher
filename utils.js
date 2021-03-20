import { UITextInput } from "Elementa/index";

const getKeyByValue = (object, value) =>
  Object.keys(object).find(key => object[key] === value);

const setAllInactive = comp => {
  if (comp.children.length) comp.children.forEach(child => this.setAllInactive(child));
  if (comp instanceof UITextInput) comp.active = false;
};

const firstBorn = comp => comp?.children?.[0];

export {
  getKeyByValue,
  setAllInactive,
  firstBorn
};