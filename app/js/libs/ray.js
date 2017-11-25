'use strict';

class Ray{
	
	static getRayCast(_coord, _length) {
		var endBloc;
		var rayResults = [];
		endBloc = [_coord[0] + _length, _coord[1]]; // right
		rayResults.push(App.map.raycast(_coord, endBloc));
		endBloc = [_coord[0] - _length, _coord[1]]; // left
		rayResults.push(App.map.raycast(_coord, endBloc));
		endBloc = [_coord[0], _coord[1] + _length]; // top
		rayResults.push(App.map.raycast(_coord, endBloc));
		endBloc = [_coord[0], _coord[1] - _length]; // bottom
		rayResults.push(App.map.raycast(_coord, endBloc));
		return rayResults;
	}
	
	static parseRays(_rays, _callback) {
		var dist;
		_rays.forEach(ray => {
			dist = 0;
			var valuesX = ray.getAllWidth();
			var valuesY = ray.getAllHeight();
			ray.getAllWidth().forEach(x => {
				ray.getAllHeight().forEach(y => {
					_callback(x, y, dist);
					dist ++;
				});
			});
		});
	}
	
	constructor(_startX = 0, _startY = 0, _endX = 0, _endY = 0) {
		this.startX = _startX;
		this.startY = _startY;
		this.endX = _endX;
		this.endY = _endY;
		this.width = 0;
		this.height = 0;
		this.impactedBloc = null;
		this.calcLength();
	}
	
	setStart(_x, _y) {
		this.startX = _x;
		this.startY = _y;
		this.calcLength();
	}
	
	setEnd(_x, _y) {
		this.endX = _x;
		this.endY = _y;
		this.calcLength();
	}
	
	calcLength() {
		this.width = Math.abs(this.endX - this.startX);
		this.height = Math.abs(this.endY - this.startY);
	}
	
	getAllWidth() {
		var values = [];
		var dir = this.startX < this.endX ? 1 : -1;
		for (var i = 0; i <= this.width; i ++) {
			values.push(this.startX + (i * dir));
		}
		return values.sort();
	}
	
	getAllHeight() {
		var values = [];
		var dir = this.startY < this.endY ? 1 : -1;
		for (var i = 0; i <= this.height; i ++) {
			values.push(this.startY + (i * dir));
		}
		return values.sort();
	}
	
}