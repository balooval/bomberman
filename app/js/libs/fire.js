'use strict';

class Fire extends Entity{
	constructor(_w, _h) {
		var mat = new THREE.MeshBasicMaterial({color:0xf4ce42,transparent:true,opacity:0.8})
		super(mat);
		this.setLayer(Renderer.layers.effects);
		this.setSize(_w, _h);
		this.timeToLive = 30;
		this.disposeFrame = 0;
	}
	
	burn() {
		this.disposeFrame = Renderer.getCurFrame() + this.timeToLive;
		Renderer.evt.listen('RENDER_FRAME_' + this.disposeFrame, this, this.dispose);
	}
	
	dispose() {
		super.dispose();
	}
}