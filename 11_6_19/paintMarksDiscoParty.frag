#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 rotate2D(vec2 _st, float _angle){
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
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
    vec3 color = vec3(sin(u_time / 2.));
    st += rotate2D(st, PI * .25);
    float time = u_time;
    vec2 grid2 = tile(st,2.);
    grid2.y -= .003 * u_mouse.y;
    color = mix(color, vec3(0.2,0.52,0.502 *(u_mouse.x * .003)), proceduralSplatter(grid2, .2 , 10.));
    vec2 grid3 = tile(st, 3.);

    grid3 -= .1;
    color = mix(color, vec3(0.6, 0.3, 0.3), proceduralSplatter(grid3, .2 * sin(time), 9.));
    gl_FragColor = vec4(color,1.0);
}