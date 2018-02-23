#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

//sprinkles range in shape from long and thin to small and round
//sprinkles come in a rainbow variety of colors
vec3 circle(vec2 st, float width, float height){
	vec2 distWidth = vec2(0.5)-st;
	vec2 distHeight = vec2(0.5) - st;
	float shape = 1. - smoothstep(width - (width * 0.1), height + (height * 0.1), dot(distWidth, distHeight) * 3.0);
	vec3 color = vec3(0.);
	color.r = st.x;
	color.g = st.y;
	color.b = st.x / st.y;
	color += shape;
	return color;
}

vec3 ellipse(vec2 st){
	st-= .5;
	float radius = length(st) * 2.5;
	float a = atan(st.y,st.x);

	float f= abs(cos(a * .2));
	float shape = 1.0 - step(f,radius);
	vec3 color = vec3(0.);
	color.r = st.x + fract(u_time/3.) ;
	color.g = (st.x / st.y) * sin(u_time);
	color.b = st.y;
	color -= shape;
	return color;
}

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

void main(){

	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec2 grid2 = tile(st, 4.);
	vec3 color = circle(grid2,0.3, 0.8);
	color += (ellipse(st));
	//gl_FragColor = vec4(color, 1.0);
	gl_FragColor = vec4(color, 1.0);
}