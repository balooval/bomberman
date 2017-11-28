'use strict';

class Map {
	constructor() {
		this.curLevel = 2;
		this.grid = [];
		this.gridDangers = [];
		this.startBlocs = [];
		// this.initGrids();
		this.frameDangersUpdate = 0;
		this.entities = {
			walkers : [], 
			bombs : [], 
			bonus : [], 
		}
		this.evt = new Evt();
		
		var material = new THREE.MeshStandardMaterial({
			map : App.Assets.Textures.get('rock'),
			color : 0xffffff, 
			metalness : 0, 
			roughness : 1, 
		});
		this.wallsEntity = new Entity(material);
		this.wallsEntity.setBlocPosition(0, 0);
		var scale = 1 / 0.4;
		this.wallsEntity.setSize(scale, scale, scale);
		
		material = new THREE.MeshStandardMaterial({
			color : 0xffe6e4, 
			metalness : 0, 
			roughness : 1, 
		});
		this.groundEntity = new Entity(material);
		this.groundEntity.setBlocPosition(0, 0);
		var scale = 1 / 0.4;
		this.groundEntity.setSize(scale, scale, scale);
	}
	
	loadLevel() {
		this.initGrids();
		this.frameDangersUpdate = Renderer.getCurFrame() + 30;
		console.log('loadLevel', this.frameDangersUpdate);
		Renderer.evt.listen('RENDER_FRAME_' + this.frameDangersUpdate, this, this.calcDangers);
	}
	
	clear() {
		console.log('clear', this.frameDangersUpdate);
		Renderer.evt.removeEventListener('RENDER_FRAME_' + this.frameDangersUpdate, this, this.calcDangers);
		this.entities.bombs.forEach(b => b.dispose());
		this.entities.bonus.forEach(b => b.dispose());
	}
	
	getPathCoord(_startCoord, _endCoord) {
		return App.Ai.AStar.getPath(_startCoord, this.grid, 
			_coord => (_coord[0] == _endCoord[0] && _coord[1] == _endCoord[1]), 
			_node => _node.costPrev + this.getDangerAtCoord([_node.x, _node.y]) * 10
		);
	}
	
	getPathBlocType(_startCoord, _blocType) {
		return App.Ai.AStar.getPath(_startCoord, this.grid, 
			_coord => this.hasNeigbourgTypeOf(_coord, _blocType), 
			_node => _node.costPrev + this.getDangerAtCoord([_node.x, _node.y]) * 10
		);
	}
	
	getPathToEntity(_startCoord, _type) {
		return App.Ai.AStar.getPath(_startCoord, this.grid, 
			_coord => this.getEntitysAtBloc(_type, _coord[0], _coord[1]).length > 0, 
			_node => _node.costPrev + this.getDangerAtCoord([_node.x, _node.y]) * 10
		);
	}
	
	getPathSafe(_startCoord) {
		return App.Ai.AStar.getPath(_startCoord, this.grid, 
			_coord => this.getDangerAtCoord(_coord) == 0, 
			_node => this.getDangerAtCoord([_node.x, _node.y])
		);
	}
	
	hasNeigbourgTypeOf(_coord, _blocType) {
		var neigbour = [
			[1, 0], 
			[-1, 0], 
			[0, 1], 
			[0, -1], 
		];
		var typeOfNb = neigbour
			.map(n => this.grid[_coord[1] + n[1]][_coord[0] + n[0]].type.typeId)
			.filter(t => t == _blocType)
			.length;
		return typeOfNb > 0;
	}
	
	
	readMap() {
		return App.Levels['Level_' + this.curLevel];
	}
	
	onBombExplode(_bomb) {
		this.evt.fireEvent('BOMB_EXPLODE');
	}
	
	getStartBloc() {
		var coord = this.startBlocs.shift();
		this.startBlocs.push(coord);
		return coord;
	}
	
	raycast(_startBloc, endBloc) {
		var dirX = _startBloc[0] < endBloc[0] ? 1 : -1;
		var dirY = _startBloc[1] < endBloc[1] ? 1 : -1;
		var lenX = Math.abs(_startBloc[0] - endBloc[0]);
		var lenY = Math.abs(_startBloc[1] - endBloc[1]);
		var lastX = 0;
		var lastY = 0;
		var ray = new Ray(_startBloc[0], _startBloc[1], endBloc[0], endBloc[1]);
		for (var y = 0; y <= lenY; y ++) {
			for (var x = 0; x <= lenX; x ++) {
				var curX = _startBloc[0] + (x * dirX);
				var curY = _startBloc[1] + (y * dirY);
				ray.impactedBloc = this.grid[curY][curX];
				if (ray.impactedBloc === null) {
					debugger;
				}
				if (ray.impactedBloc.blockFlame == true) {
					return ray;
				}
				lastX = curX;
				lastY = curY;
				ray.setEnd(curX, curY);
			}
		}
		return ray;
	}
	
	setFireOnBloc(_x, _y) {
		
	}
	
	addWalker(_walker) {
		this.entities.walkers.push(_walker);
	}
	
	addBomb(_bomb) {
		this.entities.bombs.push(_bomb);
		// this.calcDangers();
	}
	
	getDangerAtCoord(_coord) {
		return this.gridDangers[_coord[1]][_coord[0]];
	}
	
	calcDangers() {
		Renderer.evt.removeEventListener('RENDER_FRAME_' + this.frameDangersUpdate, this, this.calcDangers);
		this.gridDangers = this.gridDangers.map(col => col.map(bloc => 0));
		this.entities.bombs.map(b => this.addDanger(b.blocPosition));
		this.frameDangersUpdate = Renderer.getCurFrame() + 30;
		// console.log('calcDangers', this.frameDangersUpdate);
		Renderer.evt.listen('RENDER_FRAME_' + this.frameDangersUpdate, this, this.calcDangers);
	}
	
	addDanger(_coord) {
		var rays = Ray.getRayCast(_coord, 5);
		Ray.parseRays(rays, (x, y, dist) => {
			this.setDangerBloc([x, y], 10 - 0);
		});
	}
	
	setDangerBloc(_coord, _value) {
		var curValue = this.gridDangers[_coord[1]][_coord[0]];
		this.gridDangers[_coord[1]][_coord[0]] = Math.max(curValue, _value);
	}
	
	addBonus(_bonus) {
		this.entities.bonus.push(_bonus);
	}
	
	removeEntity(_type, _entity) {
		this.entities[_type].splice(this.entities[_type].indexOf(_entity), 1);
	}
	
	getEntitiesHitByRay(_entitieType, _ray) {
		var foundEntities = this.entities[_entitieType].filter(w => w.isHitByRay(_ray));
		return foundEntities;
	}
	
	destroyBloc(_bloc) {
		_bloc.destroy();
	}
	
	isBlocAccessible(_x, _y) {
		return this.grid[_y][_x].cost === 0;
	}
	
	getEntitysAtBloc(_type, _x, _y) {
		var entitysFound = this.entities[_type].filter(b => b.blocPosition[0] == _x && b.blocPosition[1] == _y);
		return entitysFound;
	}
	
	getSomeBonus() {
		if (this.entities.bonus.length == 0) {
			return null;
		}
		var index = Math.floor(Math.random() * this.entities.bonus.length);
		return this.entities.bonus[index];
	}
	
	initGrids() {
		this.startBlocs = [];
		this.grid = [];
		this.gridDangers = [];
		var datas = this.readMap();
		for (var y = 0; y < datas.length; y ++) {
			var row = [];
			var dangers = [];
			for (var x = 0; x < datas[y].length; x ++) {
				dangers.push(0);
				var bloc = null;
				if (datas[y][x] == 'P') {
					this.startBlocs.push([x, y]);
					// datas[y][x] = ' ';
					bloc = this.createBloc('ground', x, y);
				}
				if (datas[y][x] == 'X') {
					bloc = this.createBloc('core', x, y);
				} else if (datas[y][x] == 'O') {
					bloc = this.createBloc('basic', x, y);
					// bloc = this.createBloc('ground', x, y);
				} else if (datas[y][x] == ' ') {
					bloc = this.createBloc('ground', x, y);
				}
				if (bloc === null) {
					console.warn('no bloc', datas[y][x]);
				}
				row.push(bloc);
			}
			this.grid.push(row);
			this.gridDangers.push(dangers);
		}
	}
	
	removeBloc(_x, _y) {
		this.grid[_y][_x] = this.createBloc('ground', _x, _y);
		this.evt.fireEvent('BLOC_DESTROYED');
	}
	
	createBloc(_type, _x, _y) {
		return new Bloc(_type, _x, _y);
	}
}