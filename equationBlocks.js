import * as Elementa from "Elementa/index";
const Color = Java.type("java.awt.Color");

const createNewInput = () => {
  const background = new Elementa.UIRoundedRectangle(2)
    .setColor(new Elementa.ConstantColorConstraint(new Color(0.3, 0.3, 0.3)))
    .setX(new Elementa.PixelConstraint(0, false))
    .setY(new Elementa.SiblingConstraint(5))// 3 margin
    .setWidth(new Elementa.AdditiveConstraint(
      new Elementa.ChildBasedMaxSizeConstraint(),
      new Elementa.PixelConstraint(6, false)
    ))
    .setHeight(new Elementa.AdditiveConstraint(
      new Elementa.ChildBasedSizeConstraint(),
      new Elementa.PixelConstraint(6, false)
    ))
    .onMouseEnter(() => {
      background.setColor(new Elementa.ConstantColorConstraint(new Color(0.5, 0.5, 0.5)));
    })
    .onMouseLeave(() => {
      background.setColor(new Elementa.ConstantColorConstraint(new Color(0.3, 0.3, 0.3)));
    })
    .onMouseClick((x, y, btn) => {
      getInput(background).setActive(true);
    })
    .addChild(
      new Elementa.UITextInput("")
        .setX(new Elementa.PixelConstraint(3, false))
        .setY(new Elementa.CenterConstraint())
        .setWidth(new Elementa.PixelConstraint(100, false))
        .setHeight(new Elementa.PixelConstraint(20, false))
    );
  return background;
};

/**
 * 
 * @param {Elementa.UIRoundedRectangle} bg background object
 * @returns {Elementa.UITextInput} the text input
 */
const getInput = bg => bg.children[0]; // causing problems

export {
  createNewInput,
  getInput
};