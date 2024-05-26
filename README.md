# complex-plotter
Hosted on https://tobylam.xyz/plotter

- Plot graphs of functions from $\mathbb{R}^2$ to $\mathbb{R}^2$ and $\mathbb{C}$ to $\mathbb{C}$
    - Sketch any curve and see the image of that curve under the function in real time
- Supports one time parameter for animations
- Works on Desktop / Mobile browsers

A fork of [mabokin's](https://github.com/mabotkin/complex) complex mapping visualizer. [Raise an issue](https://github.com/tsunyinlam/mapping-visualizer/issues) for any bugs / suggestions!

# Documentation

The visualizer webpage should work on all desktop / mobile browsers.

## Basic Usage 
- Click the `Randomize` button on the center bottom to have a feel of what the plotter can do
    - Draw on the left plane by holding your mouse button and see the output on the right
    - Click the `Clear Canvas` button on the left to clear the canvas
- Decide if you're plotting a function from ℝ² to ℝ² or a function from ℂ → ℂ

### ℝ² to ℝ² functions
- Input the functions u(x,y,t) and v(x,y,t) in the textboxes
    - t is a time parameter that can be set constant or be used as a parameter for animation
    - e.g. u(x,y,t)=2*x, v(x,y,t)=y+1
-  If you intend t to be a constant parameter, set a value to it
    - Example: t=0
- Click the `Set Phi Map` button
    - Click this button everytime after you change the t parameter or the functions u and v
- Draw on the left plane using the `Pen` tool and see the output on the right

### ℂ to ℂ functions
- Input the functions f(z,t) in the textboxes
    - t is a time parameter that can be set constant or be used as a parameter for animation
    - e.g. f(z,t)=1/z
-  If you intend t to be a constant parameter, set a value to it
    - Example: t=0
- Click the `Set f Map` button
    - Click this button everytime after you change the t parameter or the function f
- Draw on the left plane using the `Pen` tool and see the output on the right

## Advanced usage

### Function input

Type `a*b` for $a\times b$ and `a^b` for $a^b$. You're allowed to use the following functions. You could find their definitions [here](https://github.com/tsunyinlam/complex/blob/master/js/complex.min.js). 

`sqrt(), cbrt(), exp(), e^(), log(), Log(), ln(), gamma(), fact(), factorial(), sin(), cos(), tan(), sec(), csc(), cot(), arcsin(), arccos(), arctan(), arcsec(), arccsc(), arccot(), arsin(), arcos(), artan(), arsec(), arcsc(), arcot(), asin(), acos(), atan(), asec(), acsc(), acot(), sinh(), cosh(), tanh(), sech(), csch(), coth(), arcsinh(), arccosh(), arctanh(), arcsech(), arccsch(), arccoth(), arsinh(), arcosh(), artanh(), arsech(), arcsch(), arcoth(), asinh(), acosh(), atanh(), asech(), acsch(), acoth(), re(), real(), im(), imag(), abs(), mag(), arg(), conj(), norm(), normal(), floor(), ceil(), ceiling(), round(), fpart(), frac(), ipart(), int()`

(Currently `conj()` is not supported)

You could also use `pi` for $\pi$. 


### Animation

- Select the function you'd like to animate
  - Φ for  ℝ² to ℝ² functions, f for ℂ → ℂ functions
- Set the initial and end values of t
- Set the total duration of the animation
  - The plotter will try to finish the whole animation within the timeframe
- Click `Play`
- Click `Stop and reset` which will redraw the plot with the t parameter set as the initial value.

### Settings

- Autolink Max Distance
    - Whenever you draw quickly on the Canvas, the canvas only registers a small number of points. Autolink interpolates these points with straight lines. The fewer the points, the better the quality of interpolation, but at the cost of performance
    - Choose a higher Max Distance for a better performance at the cost of quality
- Branch cut threshold
    - The branch cut threshold ensures that discontinuities in the function are visually represented as breaks in the lines drawn on the right plane. A higher branch cut threshold means that the code will tolerate larger differences in function values before visually breaking the line
 
## Errata

Not all aspects of the plotter is covered here. If you are confused about anything, please [raise an issue](https://github.com/tsunyinlam/mapping-visualizer/issues)!
