'use strict';

class Entity extends BaseEntity {
	
	constructor(material, geometry) {
		super();
		this.screenOffset = [-34, -30];
		var geometrySize = 4;
		this.geometry = geometry || new THREE.BoxBufferGeometry(geometrySize, geometrySize, geometrySize, 1, 1, 1);
		this.material = material || new THREE.MeshBasicMaterial({color:0xbf972a});
		this.buildMesh();
		this.onConstructed();
	}
	
	setModel(_model) {
		// var tmpBuffGeo = App.Assets.Models.get(_model).geometry.clone();
		// var tmpGeo = new THREE.Geometry().fromBufferGeometry(tmpBuffGeo);
		var tmpGeo = App.Assets.Models.get(_model).clone();
		this.mesh.geometry = tmpGeo;
	}
	
	setSize(_w, _h, _d) {
		var size = 0.4;
		this.mesh.scale.x = _w * size;
		this.mesh.scale.y = _h * size;
		this.mesh.scale.z = _d * size;
	}
	
	setAlpha(_value) {
		this.material.opacity = _value;
	}
	
	setRotation(_x, _y, _z) {
		this.mesh.rotation.set(_x, _y, _z);
	}
	
	buildMesh() {
		
		// var tmpBuffGeo = App.Assets.Models.get('bloc').geometry.clone();
		// var tmpGeo = new THREE.Geometry().fromBufferGeometry(tmpBuffGeo);
		var tmpGeo = App.Assets.Models.get('bloc').clone();
		this.mesh = new THREE.Mesh(tmpGeo, this.material);
		
		
		this.setSize(1, 1, 1);
		
		// this.mesh = new THREE.Mesh(this.geometry, this.material);
		// this.mesh.rotation.x = Math.PI / -2;
		this.updatePosition();
	}
	
}

