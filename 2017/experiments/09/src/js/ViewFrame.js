// ViewFrame.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/pbr.vert';
import fs from 'shaders/frame.frag';

class ViewFrame extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('frame');

		this.roughness = 1;
		this.specular = 0.5;
		this.metallic = 0;
		const grey = 1;
		this.baseColor = [grey, grey, grey];
	}


	render(textureRad, textureIrr) {
		this.shader.bind();

		this.shader.uniform('uRadianceMap', 'uniform1i', 0);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 1);
		textureRad.bind(0);
		textureIrr.bind(1);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);
	}



}

export default ViewFrame;