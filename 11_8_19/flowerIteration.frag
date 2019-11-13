#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 Flower(vec2 st, vec3 color){
    float pct = 0.0;
    st-= .5; //centering
    float radius = length(st) * 3.5;
    float a = atan(st.y,st.x);
    float f= abs(cos(a*2.5))+.4;
    vec3 temp = vec3(1. - smoothstep(f,radius, .9));
    temp += color;
    return temp;
}

float ovalGradient(vec2 st, float radius, float xPos) {
    return smoothstep(radius- .1, radius + .9, 1. -length(st - .5));
}

float threadedEdges(vec2 st, float width){
    return smoothstep(0., width, st.x) + smoothstep(1. - width, 1., st.x);
}
vec3 canvasPattern(vec2 st, float width, float radius, float xPos){
    vec3 color = vec3(0.);
    st *= 100.;
    st.x *= .5;
    
    vec2 st_i = floor(st);

    if (mod(st_i.y,2.) == 1.) {
        st.x -= .5;
    }
    vec2 st_f = fract(st);
    color.r = 214.0/255.0;
    color.g = 206.0/255.0;
    color.b = 192.0/255.0;
    
    float pct = threadedEdges(st_f, width);
    pct += ovalGradient(st_f,radius, xPos);
    color += pct;

    return color;
}
vec2 rotate2D(vec2 st, float _angle){
    st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * st;
    return st;
}
vec2 tile(vec2 st, float zoom){
    st *= zoom;
    vec2 st_i = floor(st);
        if (mod(st_i.x, 2.) == 0.){
        st = rotate2D(st, PI*.5);
    }
    return fract(st);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);
    color = mix(color, Flower( st, vec3(0.58,0.42,1.00)), .9);
    float time = u_time;
    vec2 grid2 = tile(st,5.);
    grid2.y -= .3 * sin(u_time / 2.);
    color = mix(color, Flower( grid2, vec3(cos(u_time), 0.8, sin(u_time))), .5);
    gl_FragColor = vec4(color,1.0);
}