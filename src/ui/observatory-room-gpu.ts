import { landscapeSeed } from '../domain/study-landscape';
import { flowClamp, observatoryLinearColor } from './observatory-flow';
import { observatoryRenderWidth } from './observatory-render-budget';

export type RoomGPUValues = {
  place: 'left' | 'right' | 'back' | 'ceiling';
  activity: number;
  density: number;
  glimmer: number;
  growth: number;
  light: number;
};
export type RoomGPUConnection = (() => void) & {
  update: (next: RoomGPUValues) => void;
  setPlaying: (playing: boolean) => void;
};

const CAPACITY = 192;
const FRAME_INTERVAL = 1000 / 30;
const places = { left: 0, right: 1, back: 2, ceiling: 3 } as const;
const finiteUnit = (value: number) => (Number.isFinite(value) ? flowClamp(value) : 0);
const normalize = (value: RoomGPUValues): RoomGPUValues => ({
  place: Object.hasOwn(places, value.place) ? value.place : 'left',
  activity: finiteUnit(value.activity),
  density: finiteUnit(value.density),
  glimmer: finiteUnit(value.glimmer),
  growth: finiteUnit(value.growth),
  light: finiteUnit(value.light),
});

// GLSL ES 3.00: art-directed local illumination, not sky/astronomical simulation.
const quadVertex = `#version 300 es
in vec2 position; out vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const roomFragment = `#version 300 es
precision highp float;
in vec2 uv;out vec4 outColor;
uniform float time,place,activity,density,glimmer,growth,light;
uniform vec3 warm,cool;
float spot(vec2 p,vec2 center,vec2 radius){vec2 d=(p-center)/radius;return exp(-dot(d,d));}
vec3 display(vec3 c){return mix(12.92*c,1.055*pow(max(c,vec3(0)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
void main(){
 vec2 p=floor(vec2(uv.x,1.-uv.y)*vec2(960.,260.));
 float glow=0.,detail=0.,tint=0.;
 if(place<.5){
  // Side illumination finds the shelf edges through gently moving suspended dust.
  float beam=exp(-pow((p.x-807.+(p.y-79.)*.68)/115.,2.));
  float grain=.65+.2*sin(p.y*.021-p.x*.013+time*.035);
  glow=beam*grain*(.032+.038*activity)+spot(p,vec2(807.,79.),vec2(160.,94.))*.025;
  detail=beam*pow(.5+.5*sin(p.x*.11-p.y*.028+time*.045),10.)*.008*density;
 }else if(place<1.5){
  // Slow refracted caustic bands stay near the glass lamp and work surface.
  vec2 q=(p-vec2(242.,166.))/vec2(105.,42.);
  float glass=exp(-dot(q,q));
  float wave=sin(q.x*5.+sin(q.y*4.-time*.2))+sin(q.y*7.+q.x*2.+time*.13);
  float caustic=pow(max(0.,1.-abs(wave)*.65),7.);
  glow=spot(p,vec2(242.,108.),vec2(115.,92.))*(.025+.045*activity);
  detail=glass*caustic*(.025+.048*density);
  tint=.28+glass*.27;
 }else if(place<2.5){
  // Pin lights remain local; the planning wall never becomes a second night sky.
  glow=(spot(p,vec2(357.,50.),vec2(28.,24.))+spot(p,vec2(504.,66.),vec2(28.,24.))+spot(p,vec2(614.,39.),vec2(28.,24.))+spot(p,vec2(644.,110.),vec2(28.,24.))+spot(p,vec2(754.,58.),vec2(28.,24.))+spot(p,vec2(376.,133.),vec2(28.,24.)))*(.017+.04*glimmer);
  detail=spot(p,vec2(480.,145.),vec2(310.,96.))*.007*density*(.7+.3*sin(time*.11));
 }else{
  vec2 d=p-vec2(480.,127.);
  float radius=length(d/vec2(1.3,1.));
  float angle=atan(d.y,d.x);
  float ribs=pow(.5+.5*cos(angle*12.+sin(radius*.013-time*.06)*.12),5.);
  glow=exp(-radius*radius/10500.)*(.055+.04*activity);
  detail=exp(-radius*radius/31000.)*ribs*(.008+.016*density);
 }
 float opacity=(glow+detail)*(.6+.4*light)*(1.+.12*growth);
 outColor=vec4(display(mix(warm,cool,tint)),clamp(opacity,0.,.18));
}`;
const dustVertex = `#version 300 es
precision highp float;
in vec4 particle;out float strength;out float hue;
uniform float time,place,activity,density,glimmer,growth,light,count,pixelScale;
// A bounded analytic curl field, sharing the sky renderer's scalar-potential method.
vec2 curl(vec2 p){return vec2(sin(p.x)*cos(p.y*1.7)*1.7,-cos(p.x)*sin(p.y*1.7));}
void main(){
 vec2 p=particle.xy;float mask=1.;
 float age=time*(.08+.12*activity);
 vec2 flow=curl(p*.012+vec2(age,-age*.7));
 if(place<.5){
  p+=flow*(4.+6.*density);p.x=mod(p.x+time*(.65+activity*.7),960.);
  mask=exp(-pow((p.x-807.+(p.y-79.)*.68)/175.,2.));
 }else if(place<1.5){
  float rise=mod(p.y+time*(2.4+3.2*activity),190.);
  p.y=187.-rise;
  p.x=242.+(particle.z-.5)*(22.+rise*.52)+flow.x*(3.+rise*.035);
  mask=sin(rise/190.*3.14159265)*(.45+.55*particle.z);
 }else if(place<2.5){
  p+=flow*2.;mask=.28+.3*exp(-pow((p.y-85.)/100.,2.));
 }else{
  p+=flow*(2.+density*3.);
  vec2 d=(p-vec2(480.,127.))/vec2(290.,150.);mask=exp(-dot(d,d));
 }
 gl_Position=vec4(p.x/480.-1.,1.-p.y/130.,0.,1.);
 gl_PointSize=(.85+particle.z*.7+growth*.2)*pixelScale;
 strength=clamp(count-float(gl_VertexID),0.,1.)*mask*(.24+.11*sin(time*.27+particle.w))*(.6+.4*light);
 hue=particle.z;
}`;
const dustFragment = `#version 300 es
precision highp float;
in float strength;in float hue;out vec4 outColor;uniform vec3 warm,cool;
vec3 display(vec3 c){return mix(12.92*c,1.055*pow(max(c,vec3(0)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
void main(){outColor=vec4(display(mix(warm,cool,step(.92,hue)*.35)),strength);}`;

/** One context: two programs, four shaders, two static buffers, 192 points and two draw calls. */
function createRoomGPU(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;
  const shaders: WebGLShader[] = [],
    programs: WebGLProgram[] = [],
    buffers: WebGLBuffer[] = [];
  const dispose = (releaseContext = false) => {
    for (const buffer of buffers) gl.deleteBuffer(buffer);
    for (const program of programs) gl.deleteProgram(program);
    for (const shader of shaders) gl.deleteShader(shader);
    if (releaseContext) gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
  try {
    const shader = (type: number, source: string) => {
      const handle = gl.createShader(type);
      if (!handle) throw Error('room shader allocation');
      shaders.push(handle);
      gl.shaderSource(handle, source);
      gl.compileShader(handle);
      if (!gl.getShaderParameter(handle, gl.COMPILE_STATUS)) throw Error('room shader compilation');
      return handle;
    };
    const program = (vertex: string, fragment: string, attribute: string) => {
      const handle = gl.createProgram();
      if (!handle) throw Error('room program allocation');
      programs.push(handle);
      gl.attachShader(handle, shader(gl.VERTEX_SHADER, vertex));
      gl.attachShader(handle, shader(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(handle);
      if (!gl.getProgramParameter(handle, gl.LINK_STATUS)) throw Error('room program linking');
      const locations = new Map<string, WebGLUniformLocation | null>();
      for (const name of [
        'time',
        'place',
        'activity',
        'density',
        'glimmer',
        'growth',
        'light',
        'count',
        'pixelScale',
        'warm',
        'cool',
      ])
        locations.set(name, gl.getUniformLocation(handle, name));
      return { handle, attribute: gl.getAttribLocation(handle, attribute), locations };
    };
    const background = program(quadVertex, roomFragment, 'position');
    const dust = program(dustVertex, dustFragment, 'particle');
    const buffer = (data: Float32Array) => {
      const handle = gl.createBuffer();
      if (!handle) throw Error('room buffer allocation');
      buffers.push(handle);
      gl.bindBuffer(gl.ARRAY_BUFFER, handle);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return handle;
    };
    const quad = buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
    const particles = new Float32Array(CAPACITY * 4);
    for (let i = 0; i < CAPACITY; i++) {
      const seed = landscapeSeed(`room-dust-${i}`);
      particles.set(
        [seed % 960, (seed >>> 10) % 260, (seed % 997) / 997, (seed % 628) / 100],
        i * 4,
      );
    }
    const points = buffer(particles);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return {
      dispose,
      draw(values: RoomGPUValues, time: number, warm: readonly number[], cool: readonly number[]) {
        const count = Math.min(
          CAPACITY,
          24 + 96 * values.density + 56 * values.growth + 16 * values.glimmer,
        );
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const uniforms = (target: typeof background) => {
          gl.useProgram(target.handle);
          const scalar = (name: string, value: number) =>
            gl.uniform1f(target.locations.get(name) ?? null, value);
          scalar('time', time);
          scalar('place', places[values.place]);
          for (const name of ['activity', 'density', 'glimmer', 'growth', 'light'] as const)
            scalar(name, values[name]);
          scalar('count', count);
          scalar('pixelScale', canvas.width / 960);
          gl.uniform3f(target.locations.get('warm') ?? null, warm[0], warm[1], warm[2]);
          gl.uniform3f(target.locations.get('cool') ?? null, cool[0], cool[1], cool[2]);
        };
        uniforms(background);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(background.attribute);
        gl.vertexAttribPointer(background.attribute, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(background.attribute);
        uniforms(dust);
        gl.bindBuffer(gl.ARRAY_BUFFER, points);
        gl.enableVertexAttribArray(dust.attribute);
        gl.vertexAttribPointer(dust.attribute, 4, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, Math.ceil(count));
        gl.disableVertexAttribArray(dust.attribute);
        return count;
      },
    };
  } catch {
    dispose();
    return null;
  }
}

/** The caller owns visibility/interaction. This renderer stores no study or preference data. */
export function connectRoomGPU(
  canvas: HTMLCanvasElement,
  initial: RoomGPUValues,
): RoomGPUConnection {
  let values = normalize(initial),
    gpu: ReturnType<typeof createRoomGPU> = null;
  let disposed = false,
    playing = true,
    frame: number | null = null;
  let time = 0,
    previous = 0,
    delivered = -Infinity,
    frames = 0;
  let lastRaf = 0,
    frameInterval = 16.7,
    slowFrames = 0,
    healthyFrames = 0,
    constrained = false;
  let displayWidth = 640,
    ratio = 1;
  let warm: readonly number[] = [],
    cool: readonly number[] = [];
  const updateColors = () => {
    warm = observatoryLinearColor(
      0.77 + 0.04 * values.glimmer,
      0.09 + 0.025 * values.activity,
      42 + 6 * values.light,
    );
    cool = observatoryLinearColor(0.71, 0.065, 225 + 12 * values.growth);
  };
  const resize = () => {
    const width = Math.min(
      960,
      observatoryRenderWidth({
        displayWidth,
        pixelRatio: ratio,
        zoom: 1,
        constrained,
        interacting: false,
      }),
    );
    if (canvas.width !== width || canvas.height !== Math.round((width * 260) / 960)) {
      canvas.width = width;
      canvas.height = Math.round((width * 260) / 960);
    }
    canvas.dataset.roomResolution = `${canvas.width}x${canvas.height}`;
  };
  const stopFrame = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    canvas.dataset.roomRaf = 'stopped';
  };
  const render = () => {
    if (!gpu || disposed) return;
    const count = gpu.draw(values, time, warm, cool);
    canvas.dataset.roomFlowTime = time.toFixed(3);
    canvas.dataset.roomFrames = String(++frames);
    canvas.dataset.roomParticles = count.toFixed(3);
  };
  const tick = (timestamp: number) => {
    frame = null;
    if (disposed || !playing || !gpu) {
      canvas.dataset.roomRaf = 'stopped';
      return;
    }
    if (lastRaf) {
      const interval = timestamp - lastRaf;
      if (interval > 0 && interval < 250) {
        frameInterval += (interval - frameInterval) * 0.08;
        slowFrames = frameInterval > 27 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        healthyFrames = frameInterval < 21 ? healthyFrames + 1 : 0;
        if (slowFrames >= 40 && !constrained) {
          constrained = true;
          healthyFrames = 0;
          resize();
        } else if (healthyFrames >= 240 && constrained) {
          constrained = false;
          slowFrames = 0;
          resize();
        }
      }
    }
    lastRaf = timestamp;
    if (timestamp - delivered >= FRAME_INTERVAL - 0.1) {
      time += previous ? Math.min(0.1, Math.max(0, (timestamp - previous) / 1000)) : 0;
      previous = delivered = timestamp;
      render();
    }
    frame = requestAnimationFrame(tick);
    canvas.dataset.roomRaf = 'running';
  };
  const wake = () => {
    stopFrame();
    previous = lastRaf = 0;
    delivered = performance.now();
    render();
    if (!disposed && playing && gpu) {
      frame = requestAnimationFrame(tick);
      canvas.dataset.roomRaf = 'running';
    }
  };
  const measure = () => {
    if (disposed) return;
    // clientWidth excludes the room's camera transform, preventing resize/zoom feedback.
    displayWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || 640;
    ratio = window.devicePixelRatio || 1;
    resize();
    if (frame === null) wake();
  };
  const initialize = () => {
    try {
      gpu = createRoomGPU(canvas);
    } catch {
      gpu = null;
    }
    canvas.dataset.roomRenderer = gpu ? 'webgl2' : 'fallback';
    canvas.dataset.roomCapacity = String(CAPACITY);
    canvas.dataset.roomDrawCalls = gpu ? '2' : '0';
    wake();
  };
  const lost = (event: Event) => {
    event.preventDefault();
    stopFrame();
    gpu?.dispose();
    gpu = null;
    canvas.dataset.roomRenderer = 'fallback';
    canvas.dataset.roomDrawCalls = '0';
  };
  const restored = () => {
    if (!disposed) initialize();
  };
  updateColors();
  canvas.dataset.roomPlace = values.place;
  measure();
  initialize();
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
  observer?.observe(canvas);
  window.addEventListener('resize', measure);
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', restored);
  const disconnect: RoomGPUConnection = () => {
    if (disposed) return;
    disposed = true;
    stopFrame();
    observer?.disconnect();
    window.removeEventListener('resize', measure);
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.removeEventListener('webglcontextrestored', restored);
    gpu?.dispose(!canvas.isConnected);
    gpu = null;
    canvas.dataset.roomRenderer = 'disposed';
    canvas.dataset.roomDrawCalls = '0';
  };
  disconnect.update = (next) => {
    if (disposed) return;
    values = normalize(next);
    updateColors();
    canvas.dataset.roomPlace = values.place;
    // A paused view gets the latest input/light in one still frame; active views keep their clock.
    if (frame === null) render();
  };
  disconnect.setPlaying = (next) => {
    if (disposed || playing === next) return;
    playing = next;
    wake();
  };
  return disconnect;
}
