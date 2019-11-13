#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(vec2 st, float radius){
	st.x -= .5;
	float pct = step(radius, 1.);
	return pct;
}

float proceduralSplatter(vec2 st, float radius, float numCircles, float spacing){
    float pct = 0.;
    st.x -= .5;
    for (float i = 1.; i < numCircles; i++){
        st.y -= (.5/ (i+spacing));
        pct +=smoothstep(radius * 1./i, radius * 1./i - .05, length(st));
    }
    return pct;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    //vec3 color = vec3(sin(u_time / 2.));
    vec3 color = vec3(1.);
    float aspect = u_resolution.x / u_resolution.y;
    st.x *= aspect; 
    color = mix(color, vec3(0.2,0.52,0.502 *(u_mouse.x * .003)), proceduralSplatter(st, .2 , 10., 1.9));
    //color = vec3(proceduralSplatter(st, .2, 10.));
    gl_FragColor = vec4(color,1.0);
}