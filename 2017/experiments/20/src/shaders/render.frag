precision highp float;
varying vec4 vColor;

void main(void) {
	if(vColor.a <= 0.01) {
		discard;
	}
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;
    gl_FragColor = vec4(vColor.rgb, 1.0);
}