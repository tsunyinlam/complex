# complex-plotter
Hosted on https://tobylam.xyz/plotter

- Plot graphs of functions from $\mathbb{R}^2$ to $\mathbb{R}^2$ and $\mathbb{C}$ to $\mathbb{C}$
    - Sketch any curve and see the image of that curve under the function in real time
- Supports one time parameter for animations
- Works on Desktop / Mobile browsers

A fork of [matbokin's](https://github.com/mabotkin/complex) complex mapping visualizer. [Raise an issue](https://github.com/tsunyinlam/mapping-visualizer/issues) for any bugs / suggestions!

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
    - `in >≈ seconds` gives you an lower bound on the time it takes to animate, usually it takes a bit longer than that to finish the animation
  
## Function input

Type `a*b` for $a\times b$ and `a^b` for $a^b$. You're allowed to use the following functions. You could find their definitions [here](https://github.com/tsunyinlam/complex/blob/master/js/complex.min.js). 

`sqrt(), cbrt(), exp(), e^(), log(), Log(), ln(), gamma(), fact(), factorial(), sin(), cos(), tan(), sec(), csc(), cot(), arcsin(), arccos(), arctan(), arcsec(), arccsc(), arccot(), arsin(), arcos(), artan(), arsec(), arcsc(), arcot(), asin(), acos(), atan(), asec(), acsc(), acot(), sinh(), cosh(), tanh(), sech(), csch(), coth(), arcsinh(), arccosh(), arctanh(), arcsech(), arccsch(), arccoth(), arsinh(), arcosh(), artanh(), arsech(), arcsch(), arcoth(), asinh(), acosh(), atanh(), asech(), acsch(), acoth(), re(), real(), im(), imag(), abs(), mag(), arg(), conj(), norm(), normal(), floor(), ceil(), ceiling(), round(), fpart(), frac(), ipart(), int()`

(Currently `conj()` is not supported)

You could also use `pi` for $\pi$. 

## Settings

- Autolink
    - Whenever you draw quickly on the Canvas, it only registers a small number of points and interpolates the rest with a straight line. The autolink ensures that the interpolation is sufficiently dense so that the plot looks smooth. The lower the number, the worser the performance.
- Animation
    - Frames per seconds: The programme would try to render that number of frames per second. The higher the number the longer it takes to finish the animation
