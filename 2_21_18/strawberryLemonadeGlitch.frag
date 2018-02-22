
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}
vec2 tile(vec2 st, float zoom){
    st *= zoom;
        if (mod(floor(st.x), 2.) == 0.){
        st = rotate2D(st, PI*.5);
    }
    return fract(st);
}

// 2D Random
float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    // Smooth Interpolation
    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);
    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}
float ovalGradient(vec2 st, float radius, float xPos) {
    // return distance(st,vec2(0.5))/3.0;
    return smoothstep(radius- (.1 - noise(st)), radius + (.6 - noise(st)), 1. -length(random(st) - .5));
}
float threadedEdges(vec2 st, float width){
    return .9 - smoothstep(0., 0.1, st.x) + smoothstep(0.6, .7, st.x);
}
vec3 canvasPattern(vec2 st, float width, float radius, float xPos){
    vec3 color = vec3(0.);
    st *= 100.;
    st.x *= .25;
    
    vec2 st_i = floor(st);

    if (mod(st_i.y,3.) == 1.) {
        st.x -= .5;
    }
    vec2 st_f = fract(st);
    color.r = 114.0/255.0;
    color.g = 106.0/255.0 * cos(u_time * noise(st));
    color.b = 172.0/255.0 * sin(u_time) * noise(st);
    
    float pct = threadedEdges(st_f, width);
    pct += ovalGradient(st_f,radius, xPos);
    color += pct;

    return color;
}

float circle(vec2 st, float radius){
    vec2 pos = vec2(0.5)-st;
    radius *= 0.75;
    return 1.-smoothstep(radius-(radius*0.05),radius+(radius*0.05),dot(pos,pos)* PI);
}

float circlePattern(vec2 st, float radius) {
    return  circle(st+vec2(0.,-.5), radius)+
            circle(st+vec2(0.,.5), radius)+
            circle(st+vec2(-.5,0.), radius)+
            circle(st+vec2(.5,0.), radius);
}
float splatter(vec2 st, float radius){
    
    st -= .5;
    float pct = smoothstep(radius, radius -.01, length(st));
    st.x -= .18;
    pct += smoothstep(radius*.5, radius*.5 - .01, length(st));
    st.x += .36;
    pct += smoothstep(radius*.5, radius*.5 - .01, length(st));
    st.y -= .15;
    st.x -= .09;
    pct += smoothstep(radius*.5, radius*.5 - .01, length(st));
    st.x -= .21;
    st.y += .03;
    pct += smoothstep(radius*.5, radius*.5 - .01, length(st));
    st += .3;
        pct += smoothstep(radius*.3, radius*.3 - .01, length(st));
    st += .1;
        pct += smoothstep(radius*.2, radius*.2 - .01, length(st));
    st += .05;
        pct += smoothstep(radius*.3, radius*.3 - .01, length(st));
    st.x +=.1;
        pct += smoothstep(radius*.2, radius*.2 - .01, length(st));
    return pct;
}

float proceduralSplatter(vec2 st, float radius, float numCircles){
    float pct = 0.;
    st.x -= .5;
    for (float i = 1.; i < numCircles; i++){
        st.y -=((i*.05*random(st)*noise(st))  / (i+1.));
        pct +=smoothstep(radius * 1./i, radius * 1./i - .1, length(st));
    }
    return pct;
}

float splatterPattern(vec2 st, float radius){
    return splatter(st + vec2(0., -.1), radius + .1) +
            splatter(st + vec2(0., -.2), radius - .1) +
            splatter(st + vec2(-.1, 0.), radius + .2) +
            splatter(st + vec2(-.2, 0.), radius - .2) ;
}


float procSplatterPattern(vec2 st, float radius){
    return proceduralSplatter(st + vec2(0., -.1), radius + .1, 2.) +
            proceduralSplatter(st + vec2(0., -.2), radius - .1, 2.) +
            proceduralSplatter(st + vec2(-.1, 0.), radius + .2, 1.) +
            proceduralSplatter(st + vec2(-.2, 0.), radius - .2, 5.) ;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = canvasPattern(st, sin(u_time) , (cos(u_time)),.1);
    
    vec2 grid2 = tile(st, 29.);
    grid2 += (noise(st)) - .7;
    color = mix(color, vec3(0.2,0.752,0.32), procSplatterPattern(grid2, .15));
    
    vec2 grid3 = tile(st, .9);
    grid3 -= noise(st) -.6;
    color = mix(color, vec3(0.8, 0.25, 0.32), procSplatterPattern(grid3, .4));
	gl_FragColor = vec4(color,1.0);
}