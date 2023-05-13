let fx;
let vs = `#version 300 es

precision mediump float;

in vec3 aPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {

  vec4 positionVec4 = vec4(aPosition, 1.0); // what if things that were closer were darker? (interesting)
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4 - 
    vec4(vec2(float(gl_InstanceID) * 100.0, 0.0), 0.0, 0.0);
}
`;
let fs = `#version 300 es

precision mediump float;

out vec4 outColor;

precision mediump float;

void main() { // greater distance closer to 1.0 thus brighter instead of darker
  if (mod(gl_FragCoord.x + gl_FragCoord.y, float(2)) == float(0))
    outColor = vec4(255, 0, 0, 255);
  else
    outColor = vec4(0, 0, 255, 255);
}
`;

let img;
function preload() {

  
  img = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg");
}

function setup() {
  createCanvas(400, 400, WEBGL);
  fx = createShader(vs, fs);
}

function draw() {
  background(220);

  
  shader(fx);
  
  beginShape(TRIANGLES);
  vertex(30, 20);
  vertex(85, 20);
  vertex(85, 75);
  vertex(30, 20);
  vertex(30, 75);
  vertex(85, 75);
  endShape(CLOSE, 4);
  
  resetShader();
  
  translate(0, -50);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(100);
}