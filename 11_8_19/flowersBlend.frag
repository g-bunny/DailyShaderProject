#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 Flower(vec2 st, vec3 color){
    float pct = 0.0;
    st-= .5;
    float radius = length(st) * 3.5;
    float a = atan(st.y,st.x);
    float f= abs(cos(a*2.5))+.4;
    vec3 temp = vec3(1. - smoothstep(f,radius, .9));
    temp += color;
    return temp;
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	gl_FragColor = vec4(Flower(st, vec3(0.58,0.42,1.00)),1.0);
}