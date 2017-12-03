'use strict';

class BaseEntity {
	
	constructor(material, geometry) {
		
		this.disposed = false;
		this.positionToRenderRatio = 4;
		this.screenOffset = [-34, -30];
		this.blocPosition = [0, 0];
		this.position = [3, 3];
		this.altitude = 0;
		this.direction = [0, 0];
		this.mesh = null;
		this.evt = new Evt();
	}
	
	onConstructed() {
		Renderer.addEntity(this);
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
	
	isHitByRay(_ray) {
		if (this.blocPosition[0] < Math.min(_ray.startX, _ray.endX)) {
			return false;
		}
		if (this.blocPosition[0] > Math.max(_ray.startX, _ray.endX)) {
			return false;
		}
		if (this.blocPosition[1] < Math.min(_ray.startY, _ray.endY)) {
			return false;
		}
		if (this.blocPosition[1] > Math.max(_ray.startY, _ray.endY)) {
			return false;
		}
		return true;
	}
	
	setTexture(_texture) {
		this.material.map = App.Assets.Textures.get(_texture);
	}
	
	setColor(_color) {
		this.mesh.material.color = new THREE.Color(_color);
	}
	
	setLayer(_layer) {
		this.altitude = _layer;
	}
	
	setAltitude(_value) {
		this.altitude = _value;
		this.updatePosition();
	}
	
	setBlocPosition(_x, _y) {
		this.position = this.getPositionFromBloc(_x, _y);
		this.updatePosition();
	}
	
	updatePosition() {
		this.updateBlocPosition();
		this.mesh.position.x = (this.position[0] + this.screenOffset[0]);
		this.mesh.position.z = (this.position[1] + this.screenOffset[1]);
		this.mesh.position.y = this.altitude;
	}
	
	onDirectionChanged() {
		
	}
	
	updateBlocPosition() {
		var hasChanged = false;
		var newBlocPosition = this.getBlocFromPosition(this.position[0], this.position[1]);
		if (this.blocPosition[0] != newBlocPosition[0] || this.blocPosition[1] != newBlocPosition[1]) {
			this.direction = this.setDirection(this.calcDirection(this.blocPosition, newBlocPosition));
			hasChanged = true;
		}
		this.blocPosition = newBlocPosition;
		if (hasChanged) {
			this.onChangeBloc();
		}
	}
	
	setDirection(_direction) {
		this.direction = _direction;
	}
	
	calcDirection(_start, _end) {
		var dirX = _end[0] - _start[0];
		var dirY = _end[1] - _start[1];
		return [
			dirX / Math.max(Math.abs(dirX), 1), 
			dirY / Math.max(Math.abs(dirY), 1)
		]
	}
	
	onChangeBloc() {
		this.evt.fireEvent('CHANGED_BLOC');
	}
	
	onRender(_frameId) {
		
	}
	
	dispose() {
		Renderer.removeEntity(this);
		this.disposed = true;
	}
}

