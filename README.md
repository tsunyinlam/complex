# complex-plotter
Hosted on https://tobylam.xyz/plotter

- Plot graphs of functions from $\mathbb{R}^2$ to $\mathbb{R}^2$ and $\mathbb{C}$ to $\mathbb{C}$
    - Sketch any curve and see the image of that curve under the function in real time
- Supports one time parameter for animations
- Works on Desktop / Mobile browsers

A fork of [mabokin's](https://github.com/mabotkin/complex) complex mapping visualizer. [Raise an issue](https://github.com/tsunyinlam/mapping-visualizer/issues) for any bugs / suggestions!

![screenshot](https://tobylam.xyz/assets/images/2023-11-24-screenshot.webp)

# Documentation

The visualizer webpage should work on all desktop / mobile browsers.

## Basic Usage 
- Write your f(z,t) or u(x,y,t) and v(x,y,t) in the textboxes (See below)
- Choose a value for t (if you're using it in your function declarations) 
- Click `Set Phi Map` or `Set f Map`
    - Click the set map buttons everytime you change your functions to see the changes take effect
- Draw on the left plane and see the output on the right
    - Drawing tools are on the leftmost column
    - Change color of the pen at any time
- Or choose `Phi` or `f` to animate and click `Play Animation`
    - Animate functions with one time parameter

## Function input

Type `a*b` for $a\times b$ and `a^b` for $a^b$. You're allowed to use the following functions. You could find their definitions [here](https://github.com/tsunyinlam/complex/blob/master/js/complex.min.js). 

`sqrt(), cbrt(), exp(), e^(), log(), Log(), ln(), gamma(), fact(), factorial(), sin(), cos(), tan(), sec(), csc(), cot(), arcsin(), arccos(), arctan(), arcsec(), arccsc(), arccot(), arsin(), arcos(), artan(), arsec(), arcsc(), arcot(), asin(), acos(), atan(), asec(), acsc(), acot(), sinh(), cosh(), tanh(), sech(), csch(), coth(), arcsinh(), arccosh(), arctanh(), arcsech(), arccsch(), arccoth(), arsinh(), arcosh(), artanh(), arsech(), arcsch(), arcoth(), asinh(), acosh(), atanh(), asech(), acsch(), acoth(), re(), real(), im(), imag(), abs(), mag(), arg(), conj(), norm(), normal(), floor(), ceil(), ceiling(), round(), fpart(), frac(), ipart(), int()`

(Currently `conj()` is not supported)

You could also use `pi` for $\pi$. 

## Settings

- Autolink
    - Whenever you draw quickly on the Canvas, the canvas only registers a small number of points. Autolink interpolates these points with straight lines. The fewer the points, the better the quality of interpolation, but at the cost of performance.
- Branch cut threshold
    - The branch cut threshold ensures that discontinuities in the function are visually represented as breaks in the lines drawn on the right plane. A higher branch cut threshold means that the code will tolerate larger differences in function values before visually breaking the line.