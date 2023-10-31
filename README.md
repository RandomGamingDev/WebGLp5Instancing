# WebGLp5Instancing
This library adds instancing to p5.js through the `beginShape()` &amp; `endShape()` by adding a 2nd parameter to `endShape()` that dictates how many instances you want to draw feature although it does require WebGL2 from https://github.com/RandomGamingDev/WebGL2p5

Simply include the p5.js library and then add WebGL2 to p5.js (that's only required if you're using a p5.js version older than 1.8.0 since the pull request I created for adding instancing to p5.js has been added) by including https://github.com/RandomGamingDev/WebGL2p5 and then after that include this library to add the count parameter after the MODE parameter where you put number of instances you're creating. (The count value is by default 1, and instancing doesn't work when you aren't using WebGL2.) Simply use beginShape() and endShape() as normal, but like this: endShape(MODE, count). (Also, things that shaders aren't classically applied to, like strokes just aren't instanced)

To use it you can simply include https://cdn.jsdelivr.net/gh/RandomGamingDev/WebGLp5Instancing/webglp5instancing.js in your HTML file! If you want to you can also just download the file and include it in your HTML file that way.

btw stuff updates so remember to specify a version/commit for your library if you want to use a link and don't want your code to automatically update to the newest version of the library
