'use strict';

class Blast extends Entity{
	
	constructor() {
		var material = null;
		material = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			transparent : true, 
			
		});
		super(material);
		this.material.blending = THREE.AdditiveBlending;
		// this.material.blending = THREE.MultiplyBlending;
		this.setModel('blast');
		this.tween = new App.Animation.Tween(0);
	}
	
	rebuild() {
		this.tween.value = 0;
		this.setSize(1, 1, 1);
		this.setAlpha(0.6);
		Renderer.addEntity(this);
	}
	
	start() {
		this.tween.setTargetValue(1, 16);
		this.tween.evt.listen('END', this, this.onScaleEnd);
		Renderer.evt.listen('RENDER', this, this.onRender);
	}
	
	onRender(_evt) {
		super.onRender(_evt);
		var tweenValue = this.tween.getValueAtTime(Renderer.getCurFrame());
		var scale = 8 + tweenValue * 30;
		this.setSize(scale, scale, scale);
		this.setAlpha(0.6 - tweenValue);
	}
	
	onScaleEnd() {
		this.dispose();
	}
	
	dispose() {
		Renderer.evt.removeEventListener('RENDER', this, this.onRender);
		this.tween.evt.removeEventListener('END', this, this.onScaleEnd);
		super.dispose();
		App.Pool.save('blast', this);
	}
}