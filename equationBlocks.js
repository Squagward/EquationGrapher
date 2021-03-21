import * as Elementa from "../Elementa";
const Color = Java.type("java.awt.Color");

const createNewInput = () => {
  const child = new Elementa.UITextInput("")
    .setX(new Elementa.PixelConstraint(3, false))
    .setY(new Elementa.CenterConstraint())
    .setWidth(new Elementa.PixelConstraint(100, false))
    .setHeight(new Elementa.PixelConstraint(20, false));

  const addBlock = new Elementa.UIRoundedRectangle(2)
    .setX(new Elementa.PixelConstraint(5, true, true))
    .setY(new Elementa.PixelConstraint(0, false))
    .setWidth(new Elementa.PixelConstraint(10, false))
    .setHeight(new Elementa.PixelConstraint(10, false))
    .setColor(new Elementa.ConstantColorConstraint(new Color(0, 1, 0)))
    .onMouseClick((mx, my, btn) => {
      addBlock.parent.parent.addChild(createNewInput());
    });

  const deleteBlock = new Elementa.UIRoundedRectangle(2)
    .setX(new Elementa.PixelConstraint(5, true, true))
    .setY(new Elementa.SiblingConstraint())
    .setWidth(new Elementa.PixelConstraint(10, false))
    .setHeight(new Elementa.PixelConstraint(10, false))
    .setColor(new Elementa.ConstantColorConstraint(new Color(1, 0, 0)))
    .onMouseClick((mx, my, btn) => {
      if (deleteBlock.parent.parent.children.length > 1)
        deleteBlock.parent.parent.removeChild(deleteBlock.parent);
    });

  const background = new Elementa.UIRoundedRectangle(2)
    .setColor(new Elementa.ConstantColorConstraint(new Color(0.3, 0.3, 0.3)))
    .setX(new Elementa.PixelConstraint(0, false))
    .setY(new Elementa.SiblingConstraint(5))
    .addChildren(
      child,
      addBlock,
      deleteBlock
    )
    .setWidth(new Elementa.AdditiveConstraint(
      new Elementa.ChildBasedMaxSizeConstraint(),
      new Elementa.PixelConstraint(6, false)
    ))
    .setHeight(new Elementa.PixelConstraint(20, false))
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