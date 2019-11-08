#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 Flower(vec2 st, vec3 color, float numOfPetals){
    float pct = 0.0;
    st-= .5; //centering
    float radius = length(st) * 3.5;
    float a = atan(st.y,st.x);
    float f= abs(cos(a*numOfPetals*.5))+.4;
    vec3 temp = vec3(1. - smoothstep(f,radius, .9));
    temp += color;
    return temp;
}

float ovalGradient(vec2 st, float radius, float xPos) {
    // return distance(st,vec2(0.5))/3.0;
    return smoothstep(radius- .1, radius + .9, 1. -length(st - .5));
}

float threadedEdges(vec2 st, float width){
    return smoothstep(0., width, st.x) + smoothstep(1. - width, 1., st.x);
}

vec3 canvasPattern(vec2 st, float width, float radius, float xPos){
    vec3 color = vec3(0.);
    st *= 10.;
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

vec2 rotate2D(vec2 _st, float _angle){
    //_st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    //_st += 0.5;
    return _st;
}
vec2 tile(vec2 st, float zoom){
    st *= zoom;
    vec2 st_i = floor(st);
        if (mod(st_i.x, 2.) == 0.){
        st = rotate2D(st, PI*.5);
    }
    return fract(st);
}

float proceduralSplatter(vec2 st, float radius, float numCircles){
    float pct = 0.;
    st.x -= .5;
    for (float i = 1.; i < numCircles; i++){
        st.y -=(.3/ (i+1.));
        pct +=smoothstep(radius * 1./i, radius * 1./i - .1, length(st));
    }
    return pct;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = Flower(st, vec3(0.58,0.42,1.00), 5.);
    //st += rotate2D(st, PI * .25);
    color = mix(color, Flower(st, vec3(0.70,1.00,0.73), 6.), sin(u_time/2.));
    //color = mix(color, Flower(rotate2D(st, PI * -.1), vec3(1.00,0.53,0.39)), cos(u_time / 2.)); 

    float time = u_time;
    //vec2 grid2 = tile(st,2.);
    //grid2.y -= .003 * u_mouse.y;
    //color = mix(color, vec3(0.2,0.52,0.502 *(u_mouse.x * .003)), proceduralSplatter(grid2, .2 , 10.));
    vec2 grid3 = tile(st, 3.);

    grid3 -= .1;
    //color = mix(color, vec3(0.6, 0.3, 0.3), proceduralSplatter(grid3, .2 * sin(time), 9.));
    gl_FragColor = vec4(color,1.0);
}