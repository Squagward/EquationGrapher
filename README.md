# EquationGrapher

> Basic equation grapher for ChatTriggers

# How to use

- `/graph` to open the graphing gui.
- Click on a text input on the left-hand side of the screen.
- Type in your equation the only variable that will work is `x`,
  but you can use `Math` class constants (`e`, `pi`, etc)
  - e.g. `sin(x)`, `x*sqrt(10)` etc work
    - I have made `ln` relate to the natural log, and `log` relate to log base 10
  - Also note: non real values will show up as `NaN`
- To add more graphs, press `DOWN ARROW KEY` and enter in your new equation
- When you want to graph, press `ENTER`
- You can zoom in or out using the scroll wheel
- **IMPORTANT**
  - Due to the way the equation parser works, doing `xcos(x)` will not graph.
    (It will try to find a function in the `Math` class called `xcos`, which doesn't exist)
    - Doing `x(cos(x))`, `cos(x)x`, `x*cos(x)`, etc will work
  - When in doubt, add the multiplication symbol

If you think you found bugs or additions you want to see added in,
you can open a pull request or contact me on Discord (Squagward#5513)

# Github Repository

> https://github.com/Squagward/EquationGrapher

# Credits

## Graphing algorithm

https://www.youtube.com/watch?v=E-_Lc6FrDRw

## Formula parser

https://github.com/bylexus/fparse for the original

The module version of it can be found here:

- https://github.com/Squagward/fparser
- https://www.chattriggers.com/modules/v/fparser

# To-Do List

- Allow for holding down keys
- Add zooming according to mouse position, not just according to the origin
- Add x boxes to delete equation inputs
