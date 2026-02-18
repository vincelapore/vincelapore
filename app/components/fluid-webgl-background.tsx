"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec2 u_pointer_velocity;
uniform float u_pointer_active;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;

  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = p * 2.02 + vec2(5.31, 1.27);
    amp *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = v_uv;
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.065;

  vec2 flowA = vec2(
    fbm(centered * 1.45 + vec2(t * 0.6, -t * 0.35)),
    fbm(centered * 1.45 + vec2(-t * 0.28, t * 0.52))
  );

  vec2 flowB = vec2(
    fbm(centered * 2.1 + flowA * 1.2 + vec2(-t * 0.3, t * 0.24)),
    fbm(centered * 2.1 + flowA * 1.2 + vec2(t * 0.26, -t * 0.32))
  );

  vec2 pointer = u_pointer - 0.5;
  pointer.x *= u_resolution.x / u_resolution.y;
  vec2 delta = centered - pointer;

  float body = fbm(centered * 1.05 + flowB * 1.55 - vec2(t * 0.1, -t * 0.06));
  float ridges = smoothstep(0.46, 0.86, body + fbm(centered * 2.3 + flowA * 1.1) * 0.5);
  float wisps = smoothstep(0.52, 0.96, fbm(centered * 3.2 + flowB * 0.95));

  vec3 deep = vec3(0.01, 0.03, 0.02);
  vec3 sea = vec3(0.06, 0.20, 0.15);
  vec3 foam = vec3(0.78, 0.90, 0.80);

  vec3 color = mix(deep, sea, body * 0.95);
  color = mix(color, foam, ridges * 0.72);
  color += wisps * vec3(0.08, 0.17, 0.14);

  float vignette = smoothstep(1.25, 0.1, length(centered));
  color *= vignette;

  float grain = (hash(gl_FragCoord.xy + u_time * 0.09) - 0.5) * 0.06;
  color += grain;

  vec2 vel = vec2(u_pointer_velocity.x, -u_pointer_velocity.y);
  vec2 velDir = normalize(vel + vec2(1e-6));
  vec2 wakeDelta = delta + velDir * 0.09;

  float cursorHalo = smoothstep(0.26, 0.0, length(delta));
  float cursorCore = smoothstep(0.08, 0.0, length(delta));
  float wake = smoothstep(0.24, 0.0, length(wakeDelta)) * min(length(vel) * 0.03, 1.0);

  color += vec3(0.05, 0.14, 0.11) * cursorHalo * 0.5 * u_pointer_active;
  color += vec3(0.90, 0.97, 0.93) * cursorCore * 0.4 * u_pointer_active;
  color += vec3(0.08, 0.20, 0.16) * wake * 0.35 * u_pointer_active;

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function FluidWebglBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reducedMotion) return;

        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: false,
            depth: false,
            stencil: false
        });
        if (!gl) return;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

        const positionBuffer = gl.createBuffer();
        if (!positionBuffer) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const resolutionLocation = gl.getUniformLocation(
            program,
            "u_resolution"
        );
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const pointerLocation = gl.getUniformLocation(program, "u_pointer");
        const pointerVelocityLocation = gl.getUniformLocation(
            program,
            "u_pointer_velocity"
        );
        const pointerActiveLocation = gl.getUniformLocation(
            program,
            "u_pointer_active"
        );

        let rafId = 0;
        const start = performance.now();
        let pointerX = 0.5;
        let pointerY = 0.5;
        let pointerVelocityX = 0;
        let pointerVelocityY = 0;
        const pointerActive = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
            const width = Math.floor(canvas.clientWidth * dpr);
            const height = Math.floor(canvas.clientHeight * dpr);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }
        };

        const frameIntervalMs = 1000 / 30;
        let lastFrameTime = 0;

        const render = (now: number) => {
            if (document.visibilityState !== "visible") {
                rafId = window.requestAnimationFrame(render);
                return;
            }

            if (now - lastFrameTime < frameIntervalMs) {
                rafId = window.requestAnimationFrame(render);
                return;
            }
            lastFrameTime = now;

            resize();

            const elapsed = (performance.now() - start) * 0.001;
            pointerX = 0.5;
            pointerY = 0.5;
            pointerVelocityX = 0;
            pointerVelocityY = 0;

            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, elapsed);
            if (pointerLocation) {
                gl.uniform2f(pointerLocation, pointerX, pointerY);
            }
            if (pointerVelocityLocation) {
                gl.uniform2f(
                    pointerVelocityLocation,
                    pointerVelocityX,
                    pointerVelocityY
                );
            }
            if (pointerActiveLocation) {
                gl.uniform1f(pointerActiveLocation, pointerActive);
            }

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            rafId = window.requestAnimationFrame(render);
        };

        rafId = window.requestAnimationFrame(render);
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            window.cancelAnimationFrame(rafId);
            gl.deleteBuffer(positionBuffer);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
        };
    }, []);

    return (
        <div className='landing__webgl' aria-hidden='true'>
            <canvas ref={canvasRef} className='landing__webgl-canvas' />
        </div>
    );
}
