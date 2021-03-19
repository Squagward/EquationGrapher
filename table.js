import * as Elementa from "Elementa/index";
const Color = Java.type("java.awt.Color");

const generateBlock = () => {
  return new Elementa.UIRoundedRectangle(2)
    .setX(new Elementa.PixelConstraint(10, true))
    .setY(new Elementa.CenterConstraint())
    .setWidth(new Elementa.AdditiveConstraint(
      new Elementa.ChildBasedMaxSizeConstraint(),
      new Elementa.PixelConstraint(10, true)
    ))
    .setHeight(new Elementa.AdditiveConstraint(
      new Elementa.ChildBasedSizeConstraint(5),
      new Elementa.PixelConstraint(10, false)
    ));
};

/**
 * @param {Elementa.UIRoundedRectangle} comp 
 * @param {string} rowName the start of the text on that row
 * @param {Color} color
 */
const addTableRow = (comp, color, text = "X") => {
  const row = new Elementa.UIText(text)
    .setX(new Elementa.PixelConstraint(5, false))
    .setColor(new Elementa.ConstantColorConstraint(color));

  if (!comp.children.length)
    row.setY(new Elementa.PixelConstraint(5, false));
  else
    row.setY(new Elementa.SiblingConstraint(5));
  comp
    .addChild(row)
    .setHeight(new Elementa.AdditiveConstraint(
      new Elementa.ChildBasedSizeConstraint(5),
      new Elementa.PixelConstraint(10, false)
    ))
    .setY(new Elementa.CenterConstraint());
};

/**
 * @param {Elementa.UIRoundedRectangle} comp 
 * @param {number} index 
 */
const deleteRow = (comp, index) => {
  const kids = [...comp.children];
  kids.splice(index, 1);
  comp
    .clearChildren()
    .addChildren(kids);
};

/**
 * @param {Elementa.UIRoundedRectangle} comp 
 * @param {string} rowName 
 * @param {*} value adds to row name
 */
const setRowValue = (comp, index, name, value) => { // causing problems
  comp.children[index].setText(`${name} ${value}`);
};

const setAllInactive = (comp) => {
  if (comp.children.length) comp.children.forEach(child => this.setAllInactive(child));
  if (comp instanceof Elementa.UITextInput) comp.setActive(false);
};

export {
  generateBlock,
  addTableRow,
  deleteRow,
  setRowValue,
  setAllInactive
};