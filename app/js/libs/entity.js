'use strict';

class Entity extends BaseEntity {
	
	constructor(material, geometry) {
		super();
		var geometrySize = 4;
		this.geometry = geometry || new THREE.BoxBufferGeometry(geometrySize, geometrySize, geometrySize, 1, 1, 1);
		this.material = material || new THREE.MeshBasicMaterial({color:0xbf972a});
		this.buildMesh();
		this.onConstructed();
	}
	
	setModel(_model) {
		var tmpBuffGeo = App.Assets.Models.get(_model).clone();
		var tmpGeo = new THREE.Geometry().fromBufferGeometry(tmpBuffGeo);
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
		const geometry = new THREE.Geometry();
		geometry.computeFaceNormals();              
		geometry.mergeVertices()
		geometry.computeVertexNormals();
		this.mesh = new THREE.Mesh(geometry, this.material);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.setSize(1, 1, 1);
		this.updatePosition();
	}
	
	merge(_entity, _coord) {
		var pos = this.getPositionFromBloc(_coord[0], _coord[1]);
		_entity.mesh.position.set(
			pos[0] - App.blocSize / 2, 
			0, 
			pos[1] - App.blocSize / 2, 
		);
		_entity.mesh.updateMatrix();
		this.mesh.geometry.merge(_entity.mesh.geometry, _entity.mesh.matrix);
		this.mesh.geometry.verticesNeedUpdate = true;
		this.mesh.geometry.elementsNeedUpdate = true;
		this.mesh.geometry.uvsNeedUpdate = true;
	}
	
}

