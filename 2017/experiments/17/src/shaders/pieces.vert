// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;

uniform vec3 uHit;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec3 vExtra;

const float minDist = 3.0;
const float PI = 3.141592653;
const float PI2 = PI * 2.0;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main(void) {

	float distToHit = distance(aPosOffset.xy, uHit.xy);
	float d = smoothstep(minDist - 1.0, minDist, distToHit);
	// a += a * aExtra.z * 5.0;

	float a = aExtra.y + mix(aExtra.z, 1.0, .5) * uTime;
	a = mod(a, PI2) - PI;
	a *= d;


	vec3 position = aVertexPosition;
	position.xy *= mix(aExtra.xy, vec2(1.0), .5);

	vec3 shadowPos = position + aPosOffset;

	position.xz = rotate(position.xz, a);
	position += aPosOffset;


	vec4 worldPosition = uModelMatrix * vec4(position, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vShadowCoord = uShadowMatrix * uModelMatrix * vec4(shadowPos, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 N = aNormal;
    N.xz = rotate(N.xz, a);
    vNormal = N;
    vExtra = aExtra;
}