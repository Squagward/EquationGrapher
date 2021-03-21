import * as Elementa from "../Elementa";
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
 * @param {Color} color 
 * @param {string} text 
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
 * @param {string} name 
 * @param {*} value
 * @param {Color} color
 */
const setRowValue = (comp, index, name, value, color) => { // causing problems
  comp.children[index]
    .setText(`${name} ${value}`)
    .setColor(new Elementa.ConstantColorConstraint(color));
};

export {
  generateBlock,
  addTableRow,
  setRowValue
};