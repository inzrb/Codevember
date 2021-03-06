// ViewIcoSphere.js

var GL = bongiovi.GL;
var glm = bongiovi.glm;
var vec3 = bongiovi.glm.vec3;
var gl;
var glslify = require("glslify");

var vertices = [[0,52.573111,85.065081],[0,-52.573111,85.065081],[85.065081,0,52.573111],[85.065081,0,-52.573111],[0,52.573111,-85.065081],[0,-52.573111,-85.065081],[-85.065081,0,-52.573111],[-85.065081,0,52.573111],[52.573111,85.065081,0],[-52.573111,85.065081,0],[-52.573111,-85.065081,0],[52.573111,-85.065081,0],[20.177411,97.943209,0],[-20.177411,97.943209,0],[20.177411,73.002557,65.295472],[40.354821,85.472883,32.647736],[-20.177411,73.002557,65.295472],[-40.354821,85.472883,32.647736],[85.472883,32.647736,40.354821],[73.002557,65.295472,20.177411],[32.647736,40.354821,85.472883],[65.295472,20.177411,73.002557],[85.472883,32.647736,-40.354821],[73.002557,65.295472,-20.177411],[97.943209,0,20.177411],[97.943209,0,-20.177411],[20.177411,73.002557,-65.295472],[40.354821,85.472883,-32.647736],[65.295472,20.177411,-73.002557],[32.647736,40.354821,-85.472883],[-20.177411,73.002557,-65.295472],[-40.354821,85.472883,-32.647736],[-85.472883,32.647736,-40.354821],[-73.002557,65.295472,-20.177411],[-32.647736,40.354821,-85.472883],[-65.295472,20.177411,-73.002557],[-85.472883,32.647736,40.354821],[-73.002557,65.295472,20.177411],[-97.943209,0,-20.177411],[-97.943209,0,20.177411],[-32.647736,40.354821,85.472883],[-65.295472,20.177411,73.002557],[-20.177411,-97.943209,0],[20.177411,-97.943209,0],[-20.177411,-73.002557,65.295472],[-40.354821,-85.472883,32.647736],[20.177411,-73.002557,65.295472],[40.354821,-85.472883,32.647736],[85.472883,-32.647736,40.354821],[73.002557,-65.295472,20.177411],[32.647736,-40.354821,85.472883],[65.295472,-20.177411,73.002557],[85.472883,-32.647736,-40.354821],[73.002557,-65.295472,-20.177411],[65.295472,-20.177411,-73.002557],[32.647736,-40.354821,-85.472883],[20.177411,-73.002557,-65.295472],[40.354821,-85.472883,-32.647736],[-20.177411,-73.002557,-65.295472],[-40.354821,-85.472883,-32.647736],[-32.647736,-40.354821,-85.472883],[-65.295472,-20.177411,-73.002557],[-85.472883,-32.647736,-40.354821],[-73.002557,-65.295472,-20.177411],[-85.472883,-32.647736,40.354821],[-73.002557,-65.295472,20.177411],[-32.647736,-40.354821,85.472883],[-65.295472,-20.177411,73.002557],[0,20.177411,97.943209],[0,-20.177411,97.943209],[0,20.177411,-97.943209],[0,-20.177411,-97.943209],[0,93.417236,35.682209],[57.735027,57.735027,57.735027],[93.417236,35.682209,0],[57.735027,57.735027,-57.735027],[0,93.417236,-35.682209],[-57.735027,57.735027,-57.735027],[-93.417236,35.682209,0],[-57.735027,57.735027,57.735027],[0,-93.417236,35.682209],[57.735027,-57.735027,57.735027],[93.417236,-35.682209,0],[57.735027,-57.735027,-57.735027],[0,-93.417236,-35.682209],[-57.735027,-57.735027,-57.735027],[-93.417236,-35.682209,0],[-57.735027,-57.735027,57.735027],[-35.682209,0,93.417236],[35.682209,0,93.417236],[35.682209,0,-93.417236],[-35.682209,0,-93.417236]];
var faces = [[18,14,10],[73,13,14],[14,18,73],[17,73,18],[16,9,13],[13,73,16],[15,16,73],[73,17,15],[1,15,17],[16,20,9],[74,19,20],[20,16,74],[15,74,16],[22,3,19],[19,74,22],[21,22,74],[74,15,21],[1,21,15],[20,24,9],[75,23,24],[24,20,75],[19,75,20],[26,4,23],[23,75,26],[25,26,75],[75,19,25],[3,25,19],[24,28,9],[76,27,28],[28,24,76],[23,76,24],[30,5,27],[27,76,30],[29,30,76],[76,23,29],[4,29,23],[28,13,9],[77,14,13],[13,28,77],[27,77,28],[32,10,14],[14,77,32],[31,32,77],[77,27,31],[5,31,27],[35,31,5],[78,32,31],[31,35,78],[36,78,35],[34,10,32],[32,78,34],[33,34,78],[78,36,33],[7,33,36],[39,33,7],[79,34,33],[33,39,79],[40,79,39],[38,10,34],[34,79,38],[37,38,79],[79,40,37],[8,37,40],[38,18,10],[80,17,18],[18,38,80],[37,80,38],[41,1,17],[17,80,41],[42,41,80],[80,37,42],[8,42,37],[48,44,12],[81,43,44],[44,48,81],[47,81,48],[46,11,43],[43,81,46],[45,46,81],[81,47,45],[2,45,47],[52,49,3],[82,50,49],[49,52,82],[51,82,52],[48,12,50],[50,82,48],[47,48,82],[82,51,47],[2,47,51],[49,25,3],[83,26,25],[25,49,83],[50,83,49],[53,4,26],[26,83,53],[54,53,83],[83,50,54],[12,54,50],[53,55,4],[84,56,55],[55,53,84],[54,84,53],[57,6,56],[56,84,57],[58,57,84],[84,54,58],[12,58,54],[57,59,6],[85,60,59],[59,57,85],[58,85,57],[43,11,60],[60,85,43],[44,43,85],[85,58,44],[12,44,58],[59,61,6],[86,62,61],[61,59,86],[60,86,59],[63,7,62],[62,86,63],[64,63,86],[86,60,64],[11,64,60],[63,39,7],[87,40,39],[39,63,87],[64,87,63],[65,8,40],[40,87,65],[66,65,87],[87,64,66],[11,66,64],[65,68,8],[88,67,68],[68,65,88],[66,88,65],[45,2,67],[67,88,45],[46,45,88],[88,66,46],[11,46,66],[70,67,2],[89,68,67],[67,70,89],[69,89,70],[42,8,68],[68,89,42],[41,42,89],[89,69,41],[1,41,69],[22,52,3],[90,51,52],[52,22,90],[21,90,22],[70,2,51],[51,90,70],[69,70,90],[90,21,69],[1,69,21],[30,71,5],[91,72,71],[71,30,91],[29,91,30],[56,6,72],[72,91,56],[55,56,91],[91,29,55],[4,55,29],[71,35,5],[92,36,35],[35,71,92],[72,92,71],[62,7,36],[36,92,62],[61,62,92],[92,72,61],[6,61,72]];


function ViewIcoSphere() {
	this.time = 0;
	// bongiovi.View.call(this, glslify('../shaders/sphere.vert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify('../shaders/sphere.vert'), glslify('../shaders/sphere.frag'));
}

var p = ViewIcoSphere.prototype = new bongiovi.View();
p.constructor = ViewIcoSphere;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var centers = [];
	var normals = [];
	var count = 0;


	function getNormal(p0, p1, p2) {
		var pp0 = vec3.clone(p0);
		var pp1 = vec3.clone(p1);
		var pp2 = vec3.clone(p2);
		var v0 = vec3.create();
		var v1 = vec3.create();
		var n = vec3.create();
		vec3.sub(v0, pp1, pp0);
		vec3.sub(v1, pp2, pp0);

		vec3.cross(n, v0, v1);
		vec3.normalize(n, n);

		return n;
	}

	function getCenter(p0, p1, p2) {
		var x = (p0[0] + p1[0] + p2[0])/3;
		var y = (p0[1] + p1[1] + p2[1])/3;
		var z = (p0[2] + p1[2] + p2[2])/3;

		return [x, y, z];
	}

	function addFace(p0, p1, p2, c) {
		// var c = getCenter(p0, p1, p2);
		var n = getNormal(p0, p1, p2);

		positions.push(p0);
		positions.push(p1);
		positions.push(p2);

		centers.push(c);
		centers.push(c);
		centers.push(c);

		normals.push(n);
		normals.push(n);
		normals.push(n);

		coords.push([0, 0]);
		coords.push([0, 0]);
		coords.push([0, 0]);

		indices.push(count*3);
		indices.push(count*3+1);
		indices.push(count*3+2);

		count ++;
	}


	function addPyramid(p0, p1, p2) {
		var c = getCenter(p0, p1, p2);

		addFace(p0, p1, p2, c);
		addFace([0, 0, 0], p1, p0, c);
		addFace([0, 0, 0], p2, p1, c);
		addFace([0, 0, 0], p0, p2, c);
	}

	for(var i=0; i<faces.length; i++) {
		var f = faces[i];
		var i0 = f[0]-1;
		var i1 = f[1]-1;
		var i2 = f[2]-1;

		var p0 = vertices[i0];
		var p1 = vertices[i1];
		var p2 = vertices[i2];

		addPyramid(p0, p1, p2);
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(centers, 'aCenter', 3);
	this.mesh.bufferData(normals, 'aNormal', 3);
};

p.render = function() {
	this.time += .01;
	this.shader.bind();

	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("eye", "uniform3fv", GL.camera.position);
	GL.draw(this.mesh);
};

module.exports = ViewIcoSphere;