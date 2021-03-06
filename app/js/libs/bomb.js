'use strict';

class Bomb extends Entity{
	
	static getSounds() {
		return [
			'bomb_1', 
			'bomb_2', 
		];
	}
	
	constructor(_flameSize = 3) {
		var material = null;
		material = new THREE.MeshStandardMaterial({
			color : 0x514061, 
			metalness : 0.8, 
			roughness : 0.2, 
		});
		super(material);
		this.setLayer(Renderer.layers.hazard);
		this.setModel('bomb');
		this.setRotation(0, Math.random() * 3, 0);
		this.timeToLive = 240;
		this.explodeFrame = 0;
		this.damageBlocsDistance = _flameSize;
		this.speed = [0, 0];
		this.scalesTarget = [1.2, 1.5];
		this.scaleFactor = 0.8;
		this.tween = new Tween(1);
		this.tween.evt.listen('END', this, this.switchScale);
		this.switchScale();
		this.moving = false;
		Renderer.evt.listen('RENDER', this, this.onRender);
	}
	
	onRender(_frameId) {
		super.onRender(_frameId);
		var scale = this.tween.getValueAtTime(_frameId);
		this.setSize(scale, scale, scale);
	}
	
	switchScale() {
		var nextScale = this.scalesTarget.pop();
		this.scalesTarget.unshift(nextScale);
		this.tween.setTargetValue(nextScale, 20 / this.scaleFactor, 'inOutQuart');
		this.scaleFactor += 0.1;
	}
	
	eject(_dirX, _dirY) {
		if (this.moving) {
			return false;
		}
		this.speed = [_dirX * 0.5, _dirY * 0.5];
		this.moving = true;
		Renderer.evt.listen('RENDER', this, this.onMove);
	}
	
	onMove(_evt) {
		if (this.move(this.speed[0], this.speed[1]) === false) {
			this.moving = false;
			Renderer.evt.removeEventListener('RENDER', this, this.onMove);
		}
	}
	
	move(_dirX, _dirY) {
		var nextBloc;
		nextBloc = this.getNextBloc(_dirX, 0);
		var canMove = false;
		if (this.canGoToBloc(nextBloc) !== false) {
			this.position[0] += _dirX;
			canMove = true;
		}
		nextBloc = this.getNextBloc(0, _dirY);
		if (this.canGoToBloc(nextBloc) !== false) {
			this.position[1] += _dirY;
			canMove = true;
		}
		this.updatePosition();
		return canMove;
	}
	
	canGoToBloc(_coord) {
		return App.map.isBlocAccessible(_coord[0], _coord[1]);
	}
	
	getNextBloc(_moveX, _moveY) {
		return this.getBlocFromPosition(
			this.position[0] + _moveX, 
			this.position[1] + _moveY
		);
	}
	
	ignite() {
		this.explodeFrame = Renderer.getCurFrame() + this.timeToLive;
		Renderer.evt.listen('RENDER_FRAME_' + this.explodeFrame, this, this.explode);
	}
	
	explode() {
		Renderer.evt.removeEventListener('RENDER_FRAME_' + this.explodeFrame, this, this.explode);
		if (this.disposed) {
			return false;
		}
		App.Sound.playOne(Bomb.getSounds());
		App.map.removeEntity('bombs', this);
		var rays = Ray.getRayCast(this.blocPosition, this.damageBlocsDistance);
		var walkerHited = this.getEntitiesHited('walkers', rays);
		walkerHited.forEach(w => w.takeDamage());
		this.addFire(rays);
		var blocsHited = rays.map(r => r.impactedBloc).filter(b => b !== null).filter(b => b.type.destoyable);
		blocsHited.forEach(b => App.map.destroyBloc(b));
		var bonusHited = this.getEntitiesHited('bonus', rays);
		bonusHited.forEach(b => b.dispose());
		var bombsHited = this.getEntitiesHited('bombs', rays).filter(b => b !== this);
		bombsHited.forEach(b => b.explode());
		App.map.onBombExplode(this);
		this.dispose();
	}
	
	addBlast() {
		var blast = App.Pool.get('blast');
		blast.setBlocPosition(this.blocPosition[0], this.blocPosition[1]);
		blast.start();
	}
	
	getEntitiesHited(_entitieType, _rays) {
		var hits = _rays.reduce((prev, ray) => prev.concat(App.map.getEntitiesHitByRay(_entitieType, ray)), []);
		hits = [...new Set(hits)];
		return hits;
	}
	
	addFire(_rays) {
		var offset = [
			[0, 0], 
			[1, 0], 
			[-1, 0], 
			[0, 1], 
			[0, -1], 
		].map(o => [o[0] * 0.3, o[1] * 0.3]);
		Ray.parseRays(_rays, (x, y) => {
			var fire;
			offset.forEach(o => {
				fire = App.Pool.get('fire');
				fire.setBlocPosition(x + o[0], y + o[1]);
				fire.burn();
			});
		});
	}
	
	dispose() {
		Renderer.evt.removeEventListener('RENDER', this, this.onRender);
		this.tween.evt.removeEventListener('END', this, this.switchScale);
		super.dispose();
	}
}