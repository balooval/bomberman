'use strict';

class Sprite extends BaseEntity {
	
	constructor(material, geometry) {
		super();
		this.screenOffset = [-34, -28];
		this.material = new THREE.SpriteMaterial({map:App.Assets.Textures.get('default'),color:0xffffff,transparent:true,opacity:1});
		this.buildMesh();
		this.onConstructed();
	}
	
	setSize(_size) {
		this.mesh.scale.x = _size;
		this.mesh.scale.y = _size;
		this.mesh.scale.z = _size;
	}
	
	buildMesh() {
		this.mesh = new THREE.Sprite(this.material);
		this.updatePosition();
	}
	
}

