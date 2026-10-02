// WebGL2 / GLSL ES 3.00. Transparent sky overlay; fixed pixel grid preserves the cover's art.
export const skyVertex = `#version 300 es
in vec2 position; out vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
export const skyFragment = `#version 300 es
precision highp float;
in vec2 uv; out vec4 outColor;
uniform float time, growth, activity, night, lod, waveRadius, waveEnergy;
uniform vec3 warm, cool;
uniform vec2 pointer; uniform float impulse;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<3;i++){n+=a*noise(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return n;}
// Analytic derivatives of a three-band potential: no four nested FBM evaluations per pixel.
vec2 curl(vec2 p){vec2 v=vec2(0.);float a=.65;for(int i=0;i<3;i++){float b=p.y*1.7;v+=a*vec2(sin(p.x)*cos(b)*1.7,-cos(p.x)*sin(b));p=p*1.91+vec2(2.7,4.1);a*=.48;}return v;}
vec3 display(vec3 c){return mix(12.92*c,1.055*pow(max(c,vec3(0)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
void main(){
 if(growth<.001&&lod<.001&&waveEnergy<.001&&impulse<.001){outColor=vec4(0.);return;}
 vec2 pixel=floor(uv*vec2(960,320)); vec2 delta=pixel-vec2(488,200);
 float ring=exp(-pow((length(delta)-waveRadius)/18.,2.))*waveEnergy;
 vec2 p=pixel/vec2(210,190); p+=normalize(delta+vec2(.001))*ring*.15;
 vec2 touch=(pixel-pointer)/170.; p+=vec2(-touch.y,touch.x)*exp(-dot(touch,touch))*impulse*.42;
 vec2 flow=curl(p*.65+time*.018); float n=fbm(p+flow*.52+time*.012);
 float vein=pow(1.-abs(sin((p.y+flow.y*.4+n*.75)*9.)),7.)*(.3+.7*lod);
 // Fine branching only emerges near the lens; it reuses the field already sampled above.
 float detail=smoothstep(.65,1.8,lod);
 float threads=pow(1.-abs(sin((p.x*1.8-p.y+flow.x*.55+n)*17.+time*.06)),12.)*detail;
 float bank=exp(-pow((pixel.y-170.-sin(p.x*1.2)*38.)/75.,2.));
 float opacity=(.025+growth*.15)*bank*(n*.8+vein*.25+threads*.12)*(.18+night*.82);
 vec3 c=mix(cool,warm,clamp(n*.7+growth*.3,0.,1.));
 // Selective analytic bloom around luminous veins/rings, leaving the rest transparent.
 float bloom=pow(vein,3.)*growth*.045+threads*growth*.016+ring*.22;
 outColor=vec4(display(c),clamp(opacity+bloom,0.,.38));
}`;
export const particleVertex = `#version 300 es
precision highp float;
in vec4 particle; out float brightness; out float tint;
uniform float time,growth,activity,lod,waveRadius,waveEnergy,count,pixelScale;
void main(){
 vec2 p=particle.xy, d=p-vec2(488,200);
 p+=normalize(d+vec2(.001))*exp(-pow((length(d)-waveRadius)/20.,2.))*waveEnergy*13.;
 gl_Position=vec4(p.x/480.-1.,1.-p.y/160.,0.,1.);
 gl_PointSize=(1.+step(.94,particle.z)*2.)*(1.+lod*.45)*pixelScale;
 brightness=clamp(count-float(gl_VertexID),0.,1.)*(.25+.75*pow(.5+.5*sin(time*(.8+particle.z)+particle.w),3.));
 tint=particle.z;
}`;
export const particleFragment = `#version 300 es
precision highp float;
in float brightness; in float tint; out vec4 outColor; uniform vec3 warm,cool; uniform float night;
void main(){vec3 c=mix(cool,warm,step(.3,tint));c=1.055*pow(max(c,vec3(0)),vec3(1./2.4))-.055;outColor=vec4(c,brightness*(.15+.85*night)*.8);}`;
