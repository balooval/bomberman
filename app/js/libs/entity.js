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
		
		var bufferGeometry = App.Assets.Models.get('bloc').clone();
		const geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
		geometry.computeFaceNormals();              
		geometry.mergeVertices()
		geometry.computeVertexNormals();
		this.mesh = new THREE.Mesh(geometry, this.material);
		
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		
		this.setSize(1, 1, 1);
		this.updatePosition();
	}
	
}

