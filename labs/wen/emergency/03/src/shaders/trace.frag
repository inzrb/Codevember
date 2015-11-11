precision mediump float;

varying vec2 uv;

const float PI      = 3.141592657;
const int NUM_BALLS = {{NUM_BALL}};
const int NUM_ITER  = {{NUM_ITER}};
// const float maxDist = 5.0;

uniform sampler2D texture;
uniform float time;
uniform float focus;
uniform float metaK;
uniform float zGap;
uniform float maxDist;
uniform vec3 bubblePos[NUM_ITER];
uniform float bubbleSize[NUM_ITER];


//	TOOLS
vec2 rotate(vec2 pos, float angle) {
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, s, -s, c) * pos;
}

float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float smin( float a, float b )
{
    return smin(a, b, 7.0);
}

float box( vec3 p, vec3 b ) {
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}


//	GEOMETRY
float size = 3.0;

vec3 ripple(vec3 pos, vec3 center, float waveHeight, float frequency) {
	float l = distance(pos, center);
	float y = sin(l*frequency-time*.25) * .5 + .5;
	y = 1.0 - pow(y, 2.0);
	float heightOffset = 1.0;
	float radius = 3.0;
	if(l > radius) {
		heightOffset = 0.0;
	}else {
		heightOffset = 1.0 - l/radius;
	}

	y *= waveHeight * heightOffset;
	vec3 returnPos = pos;
	returnPos.y += y;
	return returnPos;
}


const vec3 center0 = vec3( 1.0, .0, 1.0);
const vec3 center1 = vec3(-1.0, .0, -0.5);
// const vec3 center1 = vec3(-3.5, .0, -1.125);


float map(vec3 pos) {
	pos = ripple(pos, center0, .05, 10.0);
	pos = ripple(pos, center1, .015, 15.0);
	float dBox = box(pos, vec3(size, .001, size));

	return dBox;
}


vec3 computeNormal(vec3 pos) {
	vec2 eps = vec2(0.001, 0.0);

	vec3 normal = vec3(
		map(pos + eps.xyy) - map(pos - eps.xyy),
		map(pos + eps.yxy) - map(pos - eps.yxy),
		map(pos + eps.yyx) - map(pos - eps.yyx)
	);
	return normalize(normal);
}


//	LIGHTING


float gaussianSpecular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float shininess) {
	vec3 H = normalize(lightDirection + viewDirection);
	float theta = acos(dot(H, surfaceNormal));
	float w = theta / shininess;
	return exp(-w*w);
}

float orenNayarDiffuse(vec3 lightDirection,	vec3 viewDirection,	vec3 surfaceNormal,	float roughness, float albedo) {
	float LdotV = dot(lightDirection, viewDirection);
	float NdotL = dot(lightDirection, surfaceNormal);
	float NdotV = dot(surfaceNormal, viewDirection);

	float s = LdotV - NdotL * NdotV;
	float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

	float sigma2 = roughness * roughness;
	float A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
	float B = 0.45 * sigma2 / (sigma2 + 0.09);

	return albedo * max(0.0, NdotL) * (A + B * s / t) / 3.14159265;
}

float ao( in vec3 pos, in vec3 nor ){
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

const vec3 lightPos0 = vec3(1.0, 1.0, -1.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = 0.5;

const vec3 lightPos1 = vec3(-1.0, 0.25, -.6);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = 0.25;

//	COLOR

vec3 envLight(vec3 normal, vec3 dir) {
	vec3 eye = -dir;
	vec3 r = reflect( eye, normal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;
    vN.y = 1.0 - vN.y;
    vec3 color = texture2D( texture, vN ).rgb;
    color = max(color, vec3(0.0));
    return color;
}

float contrast(float value, float scale) {
	return .5 + (value - .5) * scale;
}
 
vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
	vec3 diff0 = orenNayarDiffuse(normalize(lightPos0), -dir, normal, 1.1, lightWeight0) * lightColor0;
	vec3 diff1 = orenNayarDiffuse(normalize(lightPos1), -dir, normal, 1.1, lightWeight1) * lightColor1;
	vec3 spec  = gaussianSpecular(normalize(lightPos0), -dir, normal, .5) * lightColor0;
	vec3 env = envLight(normal, dir);

	// color.rgb = env + (diff0 + diff1);
	color.rgb = env;

	return color;
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void main(void) {
	float timeOffset = 0.025;
	vec3 pos         = vec3(cos(time*timeOffset) * 5.5, 4.0, sin(time*timeOffset) * 5.5);
	vec3 ta          = vec3( 0.0, 0.0, 0.0 );
	mat3 ca          = setCamera( pos, ta, 0.0 );
	vec3 dir         = ca * normalize( vec3(uv,focus) );
	vec4 color       = vec4(.0);
	float prec       = .0001;
	float d;
	bool hit         = false;
	
	for(int i=0; i<NUM_ITER; i++) {
		d = map(pos);						//	distance to object

		if(d < prec) {						// 	if get's really close, set as hit the object
			hit = true;
		}

		pos += d * dir;						//	move forward by
		if(length(pos) > maxDist) break;
	}


	if(hit) {
		color = vec4(1.0);
		vec3 normal = computeNormal(pos);
		color = getColor(pos, dir, normal);
	}
	

    gl_FragColor = color;
}