// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D texturePos;
uniform sampler2D textureVel;
uniform sampler2D textureExtra;
uniform sampler2D textureLife;
uniform float percent;
uniform float time;
uniform vec2 uViewport;

varying vec4 vColor;
varying vec3 vNormal;

const float radius = 0.005;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 pos 	 = texture2D(texturePos, uv).rgb;
	vec3 vel 	 = texture2D(textureVel, uv).rgb;
	vec3 extra   = texture2D(textureExtra, uv).rgb;

	gl_Position  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	

	float g 	 = sin(extra.r + time * mix(extra.r, 1.0, .5));
	g 			 = smoothstep(0.0, 1.0, g);
	g 			 = mix(g, 1.0, .5);
	vColor       = vec4(vec3(g), 1.0);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (1.0 + extra.x * 1.0);

	vNormal 	 = aNormal;
}