'use strict';

class Map {
	constructor() {
		this.gridSize = 15;
		this.startBlocs = [
			[1, 1], 
			[this.gridSize - 2, 1], 
			[this.gridSize - 2, this.gridSize - 2], 
			[1, this.gridSize - 2], 
		]
		this.grid = this.initGrid(this.gridSize);
		this.grid = this.closeGrid(this.grid);
		this.placeBlocs(this.grid);
		this.placeBlocsAssets(this.grid);
		this.blocs = [];
		this.entities = {
			walkers : [], 
			bombs : [], 
		}
	}
	
	getStartBloc() {
		return this.startBlocs.shift();
	}
	
	raycast(_startPos, _dir, _length) {
		for (var y = 0; y <= _length[1]; y ++) {
			for (var x = 0; x <= _length[0]; x ++) {
				var curX = _startPos[0] + (x * _dir[0]);
				var curY = _startPos[1] + (y * _dir[1]);
				var value = this.grid[curY][curX];
				if (value == 1) {
					return [
						_startPos[0], 
						_startPos[1], 
						curX, 
						curY 
					]
				}
			}
		}
		return [
			_startPos[0], 
			_startPos[1], 
			_startPos[0] + (_dir[0] * _length[0]), 
			_startPos[1] + (_dir[1] * _length[1])
		]
	}
	
	addWalker(_walker) {
		this.entities.walkers.push(_walker);
	}
	
	addBomb(_bomb) {
		this.entities.bombs.push(_bomb);
	}
	
	removeBomb(_bomb) {
		this.entities.bombs.splice(this.entities.bombs.indexOf(_bomb), 1);
	}
	
	getEntitiesInSquare(_entitieType, _square) {
		var foundEntities = this.entities[_entitieType].filter(w => w.isInBlocSquare(_square));
		return foundEntities;
	}
	
	isBlocAccessible(_x, _y) {
		return this.grid[_y][_x] == 0;
	}
	
	placeBlocsAssets(_grid) {
		_grid.forEach((row, y) => row.forEach((col, x) => {
			if (_grid[y][x] == 1) {
				var bloc = new Entity();
				bloc.setBlocPosition(x, y);
				bloc.setColor(0x5e706b);
			}
		}));
	}
	
	initGrid(_size) {
		var grid = [];
		for (var y = 0; y < _size; y ++) {
			var row = [];
			for (var x = 0; x < _size; x ++) {
				row.push(0);
			}
			grid.push(row);
		}
		return grid;
	}
	
	closeGrid(_grid) {
		var gridSize = _grid.length;
		for (var y = 0; y < gridSize; y ++) {
			for (var x = 0; x < gridSize; x ++) {
				if (y == 0 || y == gridSize - 1) {
					_grid[y][x] = 1;
				}
				if (x == 0 || x == gridSize - 1) {
					_grid[y][x] = 1;
				}
			}
		}
		return _grid;
	}
	
	placeBlocs(_grid) {
		_grid.forEach((row, y) => row.forEach((col, x) => {
			if (x % 2 == 0 && y % 2 == 0) {
				_grid[y][x] = 1;
			}
		}));
	}
}