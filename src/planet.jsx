import { useEffect, useRef } from 'react';
import { LAND, LAND_W, LAND_H } from './landmask.js';

/*
  A slowly rotating dotted Earth.

  - The globe itself is drawn by a small WebGL2 shader: every pixel on the disc works out
    which latitude/longitude it shows, snaps to a grid of dots, and lights the dot if that
    spot is land (from a 1° land mask). This stays smooth and crisp at any size.
  - A 2D canvas on top draws arcs from Lilongwe to cities we work with, the city markers,
    and a travelling pulse on each arc.
  - The globe is tilted toward the viewer so the top of the disc shows the tropics, which
    keeps Africa and Malawi on the horizon as it turns.
  - Only the top `band` of the disc is drawn. Drawing pauses when off screen, and with
    reduced motion it renders one still frame. Without WebGL2 it falls back to canvas dots.
*/

const RAD = Math.PI / 180;
const HOME = [-13.96, 33.79]; // Lilongwe
const CITIES = [
  [51.51, -0.13], [40.71, -74.0], [52.52, 13.4], [25.2, 55.27],
  [-1.29, 36.82], [-26.2, 28.05], [6.52, 3.38], [43.65, -79.38],
];

const maskBytes = (() => {
  const bin = atob(LAND), bits = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bits[i] = bin.charCodeAt(i);
  const out = new Uint8Array(LAND_W * LAND_H);
  for (let i = 0; i < out.length; i++) out[i] = (bits[i >> 3] >> (i & 7)) & 1 ? 255 : 0;
  return out;
})();
const isLand = (lat, lon) => {
  const r = Math.min(LAND_H - 1, Math.max(0, Math.floor(90 - lat)));
  const c = ((Math.floor(lon + 180) % LAND_W) + LAND_W) % LAND_W;
  return maskBytes[r * LAND_W + c] > 0;
};

const toVec = ([lat, lon]) => [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];
function arcPoints(a, b, steps = 56) {
  const va = toVec(a), vb = toVec(b);
  const om = Math.acos(Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]))), so = Math.sin(om) || 1;
  const lift = 0.01 + om * 0.035, pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, k1 = Math.sin((1 - t) * om) / so, k2 = Math.sin(t * om) / so, h = 1 + lift * Math.sin(Math.PI * t);
    pts.push([(va[0] * k1 + vb[0] * k2) * h, (va[1] * k1 + vb[1] * k2) * h, (va[2] * k1 + vb[2] * k2) * h]);
  }
  return pts;
}

const VERT = `#version 300 es
in vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uMask;
uniform vec2 uCenter;   // disc centre in device pixels (y up)
uniform float uR;       // disc radius in device pixels
uniform float uSpin, uTilt, uDot;
out vec4 o;
const float PI = 3.14159265;
void main() {
  vec2 q = (gl_FragCoord.xy - uCenter) / uR;
  float rr = dot(q, q);
  if (rr > 1.0) { o = vec4(0.0); return; }
  float z2 = sqrt(1.0 - rr);
  // undo tilt (about x), then undo spin (about y)
  float ca = cos(uTilt), sa = sin(uTilt);
  float y = q.y * ca + z2 * sa;
  float z1 = -q.y * sa + z2 * ca;
  float cs = cos(uSpin), sn = sin(uSpin);
  float x = q.x * cs - z1 * sn;
  float z = q.x * sn + z1 * cs;
  float lat = degrees(asin(clamp(y, -1.0, 1.0)));
  float lon = degrees(atan(x, z));
  // snap to a dot grid with roughly even spacing on the surface
  float latc = (floor((lat + 90.0) / uDot) + 0.5) * uDot - 90.0;
  float n = max(1.0, floor(360.0 * cos(radians(latc)) / uDot));
  float stepL = 360.0 / n;
  float lonc = (floor((lon + 180.0) / stepL) + 0.5) * stepL - 180.0;
  vec2 d = vec2((lon - lonc) * cos(radians(lat)), lat - latc) / uDot;
  float dotA = 1.0 - smoothstep(0.2, 0.34, length(d));
  float land = texture(uMask, vec2((lonc + 180.0) / 360.0, (90.0 - latc) / 180.0)).r;
  float isLand = step(0.5, land);
  // light from upper left, fade toward the limb
  vec3 nrm = vec3(q, z2);
  float light = 0.55 + 0.45 * max(dot(nrm, normalize(vec3(-0.35, 0.55, 0.75))), 0.0);
  float limb = smoothstep(0.0, 0.45, z2);
  vec3 landCol = mix(vec3(0.27, 0.55, 1.0), vec3(0.55, 0.88, 1.0), light);
  vec3 seaCol = vec3(0.35, 0.45, 0.85);
  float a = dotA * limb * mix(0.09, 0.92 * light, isLand);
  vec3 col = mix(seaCol, landCol, isLand);
  o = vec4(col * a, a);
}`;

function makeGL(canvas) {
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, LAND_W, LAND_H, 0, gl.RED, gl.UNSIGNED_BYTE, maskBytes);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const u = (n) => gl.getUniformLocation(prog, n);
  return { gl, uCenter: u('uCenter'), uR: u('uR'), uSpin: u('uSpin'), uTilt: u('uTilt'), uDot: u('uDot') };
}

export function Planet({ band = 0.55, speed = 3, tilt = -56 }) {
  const glRef = useRef(null), fxRef = useRef(null);
  useEffect(() => {
    const cGL = glRef.current, cFx = fxRef.current; if (!cGL || !cFx) return;
    const fx = cFx.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let G = null;
    try { G = makeGL(cGL); } catch (e) { G = null; }
    const ca = Math.cos(tilt * RAD), sa = Math.sin(tilt * RAD);
    const arcs = CITIES.map((c, i) => ({ pts: arcPoints(HOME, c), phase: i / CITIES.length }));
    const home = toVec(HOME), cityVecs = CITIES.map(toVec);
    let W = 0, H = 0, R = 0, dpr = 1, raf = 0, visible = true, fallback = null;
    const t0 = performance.now();

    const buildFallback = () => { // canvas dots when WebGL2 is unavailable
      const target = Math.round(Math.min(22000, Math.max(8000, (4 * Math.PI * R * R) / 160)));
      const L = [], ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < target; i++) {
        const y = 1 - (2 * (i + .5)) / target, lat = Math.asin(y) / RAD, lon = (((ga * i) / RAD) % 360) - 180;
        if (isLand(lat, lon)) L.push([Math.cos(lat * RAD), Math.sin(lat * RAD), lon * RAD]);
      }
      fallback = L;
    };

    // the overlay canvas starts above the globe so arcs can rise past its edge
    let pad = 0;
    const resize = () => {
      const w = cGL.clientWidth, h = cGL.clientHeight;
      if (w === W && h === H) return false;
      W = w; H = h; R = W / 2; pad = cFx.clientHeight - H;
      dpr = Math.min(window.devicePixelRatio || 1, W > 1200 ? 1.25 : 1.75);
      cGL.width = Math.round(W * dpr); cGL.height = Math.round(H * dpr);
      cFx.width = Math.round(W * dpr); cFx.height = Math.round((H + pad) * dpr);
      fx.setTransform(dpr, 0, 0, dpr, 0, pad * dpr);
      if (G) G.gl.viewport(0, 0, cGL.width, cGL.height); else buildFallback();
      return true;
    };

    const proj = (x, y, z, cs, sn) => {
      const x1 = x * cs + z * sn, z1 = -x * sn + z * cs;
      const y2 = y * ca - z1 * sa, z2 = y * sa + z1 * ca;
      return [R + x1 * R, R - y2 * R, z2];
    };

    const drawFallback = (cs, sn) => {
      const g = cGL.getContext('2d'); if (!g) return; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const path = new Path2D(), s = Math.max(1.1, R / 480);
      for (const [cl, sl, lon] of fallback) {
        const [sx, sy, z] = proj(cl * Math.sin(lon), sl, cl * Math.cos(lon), cs, sn);
        if (z > 0.05 && sy < H) path.rect(sx - s / 2, sy - s / 2, s, s);
      }
      g.fillStyle = 'rgba(110, 200, 255, .75)'; g.fill(path);
    };

    const frame = (now) => {
      const t = reduce ? 0 : Math.max(0, (now - t0) / 1000);
      const spin = (-58 + t * speed) * RAD, cs = Math.cos(spin), sn = Math.sin(spin);
      if (G) {
        const { gl } = G;
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(G.uCenter, R * dpr, (H - R) * dpr);
        gl.uniform1f(G.uR, R * dpr);
        gl.uniform1f(G.uSpin, spin); gl.uniform1f(G.uTilt, tilt * RAD);
        gl.uniform1f(G.uDot, Math.max(0.55, Math.min(1.6, 560 / R)));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } else drawFallback(cs, sn);

      // arcs, cities and Lilongwe on the 2D overlay
      fx.clearRect(0, -pad, W, H + pad);
      fx.lineWidth = 1.1; fx.lineCap = 'round';
      for (const a of arcs) {
        const P = a.pts.map(([x, y, z]) => proj(x, y, z, cs, sn));
        fx.beginPath(); let on = false;
        for (const [sx, sy, z] of P) { if (z > 0) { on ? fx.lineTo(sx, sy) : fx.moveTo(sx, sy); on = true; } else on = false; }
        fx.strokeStyle = 'rgba(140, 215, 255, .4)'; fx.stroke();
        if (!reduce) {
          const k = (t * 0.16 + a.phase) % 1, [px, py, pz] = P[Math.min(P.length - 1, Math.max(0, Math.floor(k * (P.length - 1))))];
          if (pz > 0) {
            const g = fx.createRadialGradient(px, py, 0, px, py, 6);
            g.addColorStop(0, 'rgba(235, 250, 255, .95)'); g.addColorStop(1, 'rgba(63, 208, 255, 0)');
            fx.fillStyle = g; fx.beginPath(); fx.arc(px, py, 6, 0, Math.PI * 2); fx.fill();
          }
        }
      }
      for (const v of cityVecs) {
        const [sx, sy, z] = proj(v[0], v[1], v[2], cs, sn);
        if (z > 0.08) { fx.fillStyle = `rgba(225, 242, 255, ${0.35 + z * 0.55})`; fx.beginPath(); fx.arc(sx, sy, 2.2, 0, Math.PI * 2); fx.fill(); }
      }
      const [hx, hy, hz] = proj(home[0], home[1], home[2], cs, sn);
      if (hz > 0.08) {
        const pulse = reduce ? 0.45 : (t * 0.55) % 1;
        fx.strokeStyle = `rgba(63, 208, 255, ${0.85 * (1 - pulse)})`; fx.lineWidth = 1.5;
        fx.beginPath(); fx.arc(hx, hy, 4 + pulse * 20, 0, Math.PI * 2); fx.stroke();
        fx.fillStyle = '#fff'; fx.beginPath(); fx.arc(hx, hy, 3.4, 0, Math.PI * 2); fx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    resize(); frame(performance.now());
    const ro = new ResizeObserver(() => { if (resize() && (reduce || !visible)) frame(performance.now()); });
    ro.observe(cGL);
    const io = new IntersectionObserver(([e]) => {
      const was = visible; visible = e.isIntersecting;
      if (visible && !was && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    });
    io.observe(cFx);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [band, speed, tilt]);
  const FX_PAD = 0.1; // headroom above the globe for arcs, as a fraction of its diameter
  return <>
    <canvas className="planet" ref={glRef} style={{ width: '100%', height: `${band * 100}%` }} aria-hidden="true" />
    <canvas className="planet planet-fx" ref={fxRef} style={{ width: '100%', top: `-${FX_PAD * 100}%`, height: `${(band + FX_PAD) * 100}%` }} aria-hidden="true" />
  </>;
}
