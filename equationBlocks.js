import * as Elementa from "Elementa/index";
import { firstBorn } from "./utils";
const Color = Java.type("java.awt.Color");

const createNewInput = () => {
  const child = new Elementa.UITextInput("")
    .setX(new Elementa.PixelConstraint(3, false))
    .setY(new Elementa.CenterConstraint())
    .setWidth(new Elementa.PixelConstraint(100, false))
    .setHeight(new Elementa.PixelConstraint(20, false));

  const background = new Elementa.UIRoundedRectangle(2)
    .setColor(new Elementa.ConstantColorConstraint(new Color(0.3, 0.3, 0.3)))
    .setX(new Elementa.PixelConstraint(0, false))
    .setY(new Elementa.SiblingConstraint(5))
    .addChild(child)
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
      child.setActive(true);
    });

  return background;
};

export {
  createNewInput
};