'use strict';

class Walker extends Entity{
	constructor() {
		var material = null;
		material = new THREE.MeshStandardMaterial({
			map : App.Assets.Textures.get('walker'),
			color : 0xffffff, 
			metalness : 0.0, 
			roughness : 0.9, 
		});
		super(material, new THREE.SphereBufferGeometry(2, 8, 8 ));
		this.setLayer(Renderer.layers.player);
		this.setModel('walker');
		this.setTexture('walker');
		var scale = 0.8;
		this.setSize(scale, scale, scale);
		var startBloc = App.map.getStartBloc();
		this.setBlocPosition(startBloc[0], startBloc[1]);
		this.dropDelay = 10;
		this.dropLockToFrame = 0;
		this.speed = [0, 0];
		this.speedReducer = 4;
		this.bombLoad = [];
		this.bombCapacity = 5;
		this.bombFlameSize = 2;
		this.pushBomb = this.doNothing;
		this.floatTarget = [0, 0.6];
		this.tween = new App.Animation.Tween(0);
		this.tween.evt.listen('END', this, this.switchFloating);
		this.switchFloating();
		Renderer.evt.listen('RENDER', this, this.onRender);
	}
	
	switchFloating() {
		var nextFloat = this.floatTarget.pop();
		this.floatTarget.unshift(nextFloat);
		this.tween.setTargetValue(nextFloat, 40);
	}
	
	onRender(_evt) {
		super.onRender(_evt);
		this.move(this.speed[0] / this.speedReducer, this.speed[1] / this.speedReducer);
		var alt = this.tween.getValueAtTime(Renderer.getCurFrame());
		this.setAltitude(alt);
	}
	
	takeDamage() {
		this.evt.fireEvent('TAKE_DAMAGE');
	}
	
	addSpeed() {
		this.speedReducer = Math.max(this.speedReducer * 0.8, 2);
	}
	
	addFlameSize(_value) {
		this.bombFlameSize += _value;
	}
	
	addBombCapacity(_value) {
		this.bombCapacity += _value;
	}
	
	activeBombPushing() {
		this.pushBomb = this.ejectBomb;
	}
	
	dropBomb() {
		if (this.canDrop() === false) {
			return false;
		}
		this.dropLockToFrame = Renderer.getCurFrame() + this.dropDelay;
		var bomb = new Bomb(this.bombFlameSize);
		bomb.setBlocPosition(this.blocPosition[0], this.blocPosition[1]);
		this.bombLoad.push(bomb);
		App.map.addBomb(bomb);
		App.Sound.play('drop');
		bomb.ignite();
		return true;
	}
	
	canDrop() {
		this.bombLoad = this.bombLoad.filter(b => b !== null).filter(b => b.disposed === false);
		if (this.bombLoad.length >= this.bombCapacity) {
			return false;
		}
		if (App.map.getEntitysAtBloc('bombs', this.blocPosition[0], this.blocPosition[1]).length > 0) {
			return false;
		}
		return this.dropLockToFrame < Renderer.getCurFrame();
	}
	
	move(_dirX, _dirY) {
		if (_dirX == 0 && _dirY == 0) {
			return false;
		}
		var nextPos = [this.position[0], this.position[1]];
		var nextBloc;
		var blocIsAccessible;
		nextBloc = this.getNextBloc(_dirX, 0);
		blocIsAccessible = App.map.isBlocAccessible(nextBloc[0], nextBloc[1]);
		if (blocIsAccessible !== false) {
			nextPos[0] = this.position[0] + _dirX;
		}
		nextBloc = this.getNextBloc(0, _dirY);
		blocIsAccessible = App.map.isBlocAccessible(nextBloc[0], nextBloc[1]);
		if (blocIsAccessible !== false) {
			nextPos[1] = this.position[1] + _dirY;
		}
		nextBloc = this.getBlocFromPosition(nextPos[0], nextPos[1]);
		if (this.isBlocsEqualTo(nextBloc, this.blocPosition) == false) {
			var bombs = App.map.getEntitysAtBloc('bombs', nextBloc[0], nextBloc[1]);
			var direction = this.calcDirection(this.blocPosition, nextBloc);
			bombs.forEach(b => this.pushBomb(b, direction));
			if (bombs.length > 0) {
				return false;
			}
		}
		this.position = [nextPos[0], nextPos[1]];
		this.updatePosition();
		var angle = Math.atan2(_dirY, _dirX) * -1;
		this.setRotation(0, angle, 0);
		return true;
	}
	
	isBlocsEqualTo(_blocA, _blocB) {
		if (_blocA[0] != _blocB[0]) {
			return false;
		}
		if (_blocA[1] != _blocB[1]) {
			return false;
		}
		return true;
	}
	
	getNextBloc(_moveX, _moveY) {
		return this.getBlocFromPosition(
			this.position[0] + _moveX, 
			this.position[1] + _moveY
		);
	}
	
	onChangeBloc() {
		var bombs = App.map.getEntitysAtBloc('bombs', this.blocPosition[0], this.blocPosition[1]);
		bombs.forEach(b => this.pushBomb(b, this.direction));
		var bonus = App.map.getEntitysAtBloc('bonus', this.blocPosition[0], this.blocPosition[1]);
		bonus.forEach(b => this.takeBonus(b));
		super.onChangeBloc();
	}
	
	ejectBomb(_bomb, _direction) {
		_bomb.eject(_direction[0], _direction[1]);
		return true;
	}
	
	doNothing() {
		return false;
	}
	
	takeBonus(_bonus) {
		_bonus.apply(this);
	}
	
	dispose() {
		Renderer.evt.removeEventListener('RENDER', this, this.onRender);
		super.dispose();
	}
}