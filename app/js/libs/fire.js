'use strict';

class Fire extends Sprite{
	
	constructor() {
		// console.log('createFire');
		super();
		this.setLayer(Renderer.layers.front);
		this.timeToLive = 60;
		this.disposeFrame = 0;
		this.setTexture('fire');
		this.tween = new Tween(1);
		this.material.blending = THREE.AdditiveBlending;
		// this.material.blending = THREE.MultiplyBlending;
		this.init();
	}
	
	rebuild() {
		this.material.opacity = 1;
		this.updatePosition();
		Renderer.addEntity(this);
		this.init();
	}
	
	init() {
		this.size = (Math.random() * 3) + 2;
		this.setSize(this.size);
		this.tween.value = 1;
	}
	
	burn() {
		Renderer.evt.listen('RENDER', this, this.onRender);
		this.tween.setTargetValue(0, this.timeToLive);
		this.disposeFrame = Renderer.getCurFrame() + this.timeToLive;
		Renderer.evt.listen('RENDER_FRAME_' + this.disposeFrame, this, this.dispose);
	}
	
	onRender(_frameId) {
		super.onRender(_frameId);
		var tweenValue = this.tween.getValueAtTime(_frameId);
		this.material.opacity = tweenValue;
	}
	
	dispose() {
		Renderer.evt.removeEventListener('RENDER', this, this.onRender);
		super.dispose();
		App.Pool.save('fire', this);
	}
}