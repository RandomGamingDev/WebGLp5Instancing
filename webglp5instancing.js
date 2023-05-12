p5.RendererGL.prototype._drawImmediateFill = function(count) {
  const gl = this.GL;
  this._useVertexColor = (this.immediateMode.geometry.vertexColors.length > 0);
  const shader = this._getImmediateFillShader();

  this._setFillUniforms(shader);

  for (const buff of this.immediateMode.buffers.fill) {
    buff._prepareBuffer(this.immediateMode.geometry, shader);
  }

  // LINE_STRIP and LINES are not used for rendering, instead
  // they only indicate a way to modify vertices during the _processVertices() step
  if (
    this.immediateMode.shapeMode === LINE_STRIP ||
    this.immediateMode.shapeMode === LINES
  ) {
    this.immediateMode.shapeMode = TRIANGLE_FAN;
  }

  // WebGL 1 doesn't support the QUADS and QUAD_STRIP modes, so we
  // need to convert them to a supported format. In `vertex()`, we reformat
  // the input data into the formats specified below.
  if (this.immediateMode.shapeMode === QUADS) {
    this.immediateMode.shapeMode = TRIANGLES;
  } else if (this.immediateMode.shapeMode === QUAD_STRIP) {
    this.immediateMode.shapeMode = TRIANGLE_STRIP;
  }

  this._applyColorBlend(this.curFillColor);
  gl.drawArraysInstanced( // gl.drawArrays & gl.drawElements
    this.immediateMode.shapeMode,
    0,
    this.immediateMode.geometry.vertices.length,
    count
  );

  shader.unbindShader();
};
  
p5.RendererGL.prototype.endShape = function(
  mode,
  isCurve,
  isBezier,
  isQuadratic,
  isContour,
  shapeKind,
  count
) {
  if (this.immediateMode.shapeMode === POINTS) {
    this._drawPoints(
      this.immediateMode.geometry.vertices,
      this.immediateMode.buffers.point
    );
    return this;
  }
  this.isProcessingVertices = true;
  this._processVertices(...arguments);
  this.isProcessingVertices = false;
  if (this._doFill) {
    if (this.immediateMode.geometry.vertices.length > 1) {
      this._drawImmediateFill(count); // instance
    }
  }
  if (this._doStroke) {
    if (this.immediateMode.geometry.lineVertices.length > 1) {
      this._drawImmediateStroke(); // instance
    }
  }

  this.isBezier = false;
  this.isQuadratic = false;
  this.isCurve = false;
  this.immediateMode._bezierVertex.length = 0;
  this.immediateMode._quadraticVertex.length = 0;
  this.immediateMode._curveVertex.length = 0;
  return this;
};

p5.prototype.endShape = function(mode, count = 1) {
  //p5._validateParameters('endShape', arguments);
  if (this._renderer.isP3D) {
    this._renderer.endShape(
      mode,
      this.isCurve,
      this.isBezier,
      this.isQuadratic,
      this.isContour,
      this.shapeKind,
      count
    );
  } else {
    if (count != undefined)
      console.log("Instancing count doesn't apply to non-WebGL2 based rendering");
    
    if (this.vertices.length === 0) {
      return this;
    }
    if (!this._renderer._doStroke && !this._renderer._doFill) {
      return this;
    }

    const closeShape = mode === constants.CLOSE;

    // if the shape is closed, the first element is also the last element
    if (closeShape && !isContour) {
      this.vertices.push(vertices[0]);
    }

    
    this._renderer.endShape(
      mode,
      this.vertices,
      this.isCurve,
      this.isBezier,
      this.isQuadratic,
      this.isContour,
      this.shapeKind
    );

    // Reset some settings
    this.isCurve = false;
    this.isBezier = false;
    this.isQuadratic = false;
    this.isContour = false;
    this.isFirstContour = true;

    // If the shape is closed, the first element was added as last element.
    // We must remove it again to prevent the list of vertices from growing
    // over successive calls to endShape(CLOSE)
    if (closeShape) {
      this.vertices.pop();
    }
  }
  return this;
};
