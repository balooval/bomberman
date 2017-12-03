'use strict';

class Walker extends Entity{
	constructor() {
		var material = null;
		material = new THREE.MeshStandardMaterial({
			map : App.Assets.Textures.get('walker'),
			color : 0xffffff, 
			metalness : 0.0, 
			roughness : 0.3, 
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
		this.moving = false;
		this.movingAngle = 0;
		
		this.puppet = new Puppet();
		var animeIdle = new Animation();
		animeIdle.addTimeline(
			'altitude', 
			[-0.2, 0.2], 
			[60, 60], 
			['linear', 'linear']
		);
		animeIdle.addTimeline(
			'rotation', 
			[-0.1, 0.1], 
			[60, 60],  
			['linear', 'linear']
		);
		this.puppet.addAnimation('idle', animeIdle);
		var animeJump = new Animation();
		animeJump.addTimeline(
			'altitude', 
			[0, 3], 
			[12, 16], 
			['inCubic', 'outCubic']
		);
		animeJump.addTimeline(
			'rotation', 
			[-0.8, 0.8], 
			[12, 16], 
			['inCubic', 'outCubic']
		);
		this.puppet.addAnimation('jump', animeJump);
		this.puppet.play('idle');
		
		Renderer.evt.listen('RENDER', this, this.onRender);
		this.evt.listen('MOVE_START', this, this.onMoveStart);
		this.evt.listen('MOVE_STOP', this, this.onMoveStop);
	}

	onRender(_frameId) {
		super.onRender(_frameId);
		this.processMovement();
		var puppetValues = this.puppet.getValues(_frameId);
		this.setAltitude(puppetValues.altitude);
		// this.mesh.rotateZ(puppetValues.rotation);
		// this.setRotation(puppetValues.rotation, this.movingAngle, 0);
	}
	
	processMovement() {
		var hasMoved = this.move(this.speed[0] / this.speedReducer, this.speed[1] / this.speedReducer);
		if (hasMoved && !this.moving) {
			this.evt.fireEvent('MOVE_START');
		} else if (!hasMoved && this.moving) {
			this.evt.fireEvent('MOVE_STOP');
		}
		this.moving = hasMoved;
	}
	
	onMoveStart() {
		this.puppet.play('jump');
	}
	
	onMoveStop() {
		this.puppet.play('idle');
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
		this.movingAngle = angle;
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