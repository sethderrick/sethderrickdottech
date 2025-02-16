// webgl-display.js
const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying vec2 vUv;
    void main() {
        gl_Position = aVertexPosition;
        vUv = aTextureCoord;
    }
`;

const fragmentShaderSource = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse / uResolution;
        
        // Create dynamic wave pattern
        float wave1 = sin(uv.x * 10.0 + uTime) * 0.5 + 0.5;
        float wave2 = sin(uv.y * 8.0 - uTime * 0.5) * 0.5 + 0.5;
        
        // Add mouse interaction
        float dist = length(uv - mouse);
        float ripple = sin(dist * 20.0 - uTime * 2.0) * 0.5 + 0.5;
        
        // Combine effects
        float pattern = mix(wave1, wave2, 0.5) * ripple;
        
        // Create color
        vec3 color = vec3(0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0,2,4)));
        
        gl_FragColor = vec4(color * pattern, 1.0);
    }
`;

const webGLDisplay = {
  create: async (container) => {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // Initialize WebGL
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }

    // Create shader program
    const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    // Set up geometry (a simple quad)
    const positions = new Float32Array([
      -1.0, 1.0,
      -1.0, -1.0,
      1.0, 1.0,
      1.0, -1.0,
    ]);
    const texCoords = new Float32Array([
      0.0, 1.0,
      0.0, 0.0,
      1.0, 1.0,
      1.0, 0.0,
    ]);

    // Create and bind buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    // Get attribute locations
    const positionLocation = gl.getAttribLocation(program, 'aVertexPosition');
    const texCoordLocation = gl.getAttribLocation(program, 'aTextureCoord');

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    const mouseLocation = gl.getUniformLocation(program, 'uMouse');

    // Enable attributes
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(texCoordLocation);

    let mouseX = 0;
    let mouseY = 0;
    let startTime = Date.now();

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = rect.height - (e.clientY - rect.top);
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return {
      update: () => {
        handleResize();

        // Update uniforms
        const time = (Date.now() - startTime) * 0.001;
        gl.uniform1f(timeLocation, time);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouseX, mouseY);

        // Bind position buffer and set attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Bind texCoord buffer and set attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
      cleanup: () => {
        container.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      }
    };
  },
  animate: true
};

// Helper function to create shader program
function createShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Shader program failed to link: ' + gl.getProgramInfoLog(program));
  }

  return program;
}

export default webGLDisplay;
