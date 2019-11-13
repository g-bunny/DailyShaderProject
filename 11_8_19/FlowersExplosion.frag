#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 Flower(vec2 st, vec3 color, float numOfPetals){
    float pct = 0.0;
    st-= .5;
    float radius = length(st) * 3.5;
    float a = atan(st.y,st.x);
    float b = asin (st.x);
    float c = acos (st.x);
    float f= abs(cos(a*numOfPetals*.5))+.4;
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

vec2 rotate2D(vec2 st, float angle){
    st =  mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle)) * st;
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
    vec3 color = Flower(st, vec3(0.58,0.42,1.00), 5.);
    color = mix(color, Flower(st, vec3(0.70,1.00,0.73), 6.), sin(u_time/2.));
    float time = u_time;
    vec2 grid3 = tile(st, 3.);

    grid3 -= .1;
    gl_FragColor = vec4(color,1.0);
}