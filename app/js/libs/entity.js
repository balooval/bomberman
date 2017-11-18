'use strict';

class Entity {
	
	constructor(material, geometry) {
		this.positionToRenderRatio = 4;
		this.screenOffset = [-30, -30];
		this.blocPosition = [0, 0];
		this.position = [3, 3];
		this.mesh = null;
		var geometrySize = 4;
		this.geometry = geometry || new THREE.BoxBufferGeometry(geometrySize, geometrySize, geometrySize, 1, 1, 1);
		this.material = material || new THREE.MeshBasicMaterial({color:0xbf972a});
		this.buildMesh();
		Renderer.addEntity(this);
		Renderer.evt.listen('RENDER', this, this.onRender);
	}
	
	getPositionFromBloc(_x, _y) {
		var half = App.blocSize / 2;
		return [
			_x * App.blocSize + half, 
			_y * App.blocSize + half, 
		]
	}
	
	getBlocFromPosition(_x, _y) {
		return [
			Math.floor(_x / App.blocSize), 
			Math.floor(_y / App.blocSize), 
		]
	}
	
	isInBlocSquare(_square) {
		if (this.blocPosition[0] < _square[0]) {
			return false;
		}
		if (this.blocPosition[0] > _square[2]) {
			return false;
		}
		if (this.blocPosition[1] < _square[1]) {
			return false;
		}
		if (this.blocPosition[1] > _square[3]) {
			return false;
		}
		return true;
	}
	
	setSize(_w, _h) {
		this.mesh.scale.x = _w;
		this.mesh.scale.y = _h;
	}
	
	setColor(_color) {
		this.mesh.material.color = new THREE.Color(_color);
	}
	
	setLayer(_layer) {
		this.mesh.position.y = _layer;
	}
	
	setBlocPosition(_x, _y) {
		this.position = this.getPositionFromBloc(_x, _y);
		this.updatePosition();
	}
	
	updatePosition() {
		this.blocPosition = this.getBlocFromPosition(this.position[0], this.position[1]);
		this.mesh.position.x = (this.position[0] + this.screenOffset[0]);
		this.mesh.position.z = (this.position[1] + this.screenOffset[1]);
		// console.log(this.mesh.position.x + ' ' + this.mesh.position.z);
	}
	
	buildMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.rotation.x = Math.PI / -2;
		this.updatePosition();
	}
	
	onRender(_evt) {
		// Debug.set('debug_a', 'ok debug');
	}
	
	dispose() {
		Renderer.removeEntity(this);
	}
}

