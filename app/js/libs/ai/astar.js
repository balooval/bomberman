'use strict';

var App = (function(_app){
	_app.Ai = _app.Ai || {};
	
	var gridMap = null;
	var nodesOpen = [];
	var nodesClose = [];
	var evalCostFn = null;
	
	// var debugging = true;
	var debugging = false;
	var debugEnt = [];
	
	var api = {
		getPath : function(_startPt, _gridMap, _evalReachFn, _evalCostFn = null) {
			clearDebug();
			evalCostFn = _evalCostFn;
			var result = {
				success : false, 
				path : [], 
				steps : 0,
				dest : [_startPt[0], _startPt[1]], 
			};
			gridMap = _gridMap;
			nodesOpen = [];
			nodesClose = [];
			var curNode = new Node(_startPt[0], _startPt[1], 0);
			moveNodeToOpen(curNode);
			for (var i = 0; i < 100; i ++) {
				curNode = getNextNode(curNode);
				if (curNode === null) {
					// console.log('BREAK');
					var closestNode = getBestNode(nodesClose);
					result.success = false;
					result.steps = closestNode.costPrev;
					result.path = buildPath(closestNode);
					result.dest = [closestNode.x, closestNode.y];
					break;
				}
				if (_evalReachFn([curNode.x, curNode.y])) {
					result.success = true;
					result.steps = curNode.costPrev;
					result.path = buildPath(curNode);
					result.dest = [curNode.x, curNode.y];
					break;
				}
			}
			return result;
		}, 
	};
	
	function clearDebug() {
		debugEnt.map(e => e.dispose());
		debugEnt = [];
	}
	
	function addDebug(_node) {
		if (!debugging) {
			return false;
		}
		var toto = new Entity();
		toto.setBlocPosition(_node.x, _node.y);
		toto.setSize(0.5, 0.5, 0.5);
		debugEnt.push(toto);
	}
	
	function buildPath(_endNode) {
		var curNode = _endNode;
		var path = [curNode];
		while (curNode !== null) {
			addDebug(curNode);
			path.unshift(curNode.prevNode);
			curNode = curNode.prevNode;
		}
		path.shift();
		path.shift();
		return path;
	}
	
	function moveNodeToClose(_node) {
		nodesOpen.splice(nodesOpen.indexOf(_node), 1);
		nodesClose.push(_node);
		_node.isClose = true;
	}
	
	function moveNodeToOpen(_node) {
		nodesOpen.push(_node);
		_node.isOpen = true;
	}
	
	function changeOpenParentIfNeeded(_nodes, _curNode) {
		var neighborsInOpen = _nodes.filter(n => n.isOpen);
		var newCost = _curNode.costPrev + 1;
		neighborsInOpen = neighborsInOpen.filter(n => n.costPrev > newCost);
		neighborsInOpen.forEach(n => {
			n.costPrev = newCost;
			n.prevNode = _curNode;
		});
	}
	
	function getNextNode(_node) {
		moveNodeToClose(_node);
		var neighbors = getNeighbors(_node).filter(n => !n.isClose);;
		changeOpenParentIfNeeded(neighbors, _node);
		neighbors = neighbors.filter(n => !n.isOpen);
		neighbors.forEach(moveNodeToOpen);
		var nextNode = getBestNode(nodesOpen);
		return nextNode;
	}
	
	function getBestNode(_nodes) {
		if (_nodes.length == 0) {
			return null;
		}
		return _nodes.sort((a, b) => {
			var costA = evalCostFn(a);
			var costB = evalCostFn(b);
			if (costA == costB) return 0;
			if (costA > costB) return 1;
			if (costA < costB) return -1;
		})[0];
	}
	
	function getNodeAtPos(_coord, _prev) {
		var node;
		node = searchNodeByPos(nodesOpen, _coord[0], _coord[1]);
		if (node !== null) return node;
		node = searchNodeByPos(nodesClose, _coord[0], _coord[1]);
		if (node !== null) return node;
		return new Node(_coord[0], _coord[1], isBlocWalkable(_coord), _prev);
	}
	
	function searchNodeByPos(_list, _x, _y) {
		var filtered = _list.filter(n => {
			return n.x == _x && n.y == _y;
		});
		if (filtered.length == 0) {
			return null;
		}
		return filtered[0];
	}
	
	function getNeighbors(_node) {
		var aroundCoord = [
			[-1, 0], 
			[0, -1], 
			[1, 0], 
			[0, 1], 
		];
		var neighbors = aroundCoord
			.map(coord => [coord[0] + _node.x, coord[1] + _node.y])
			.map(coord => getNodeAtPos(coord, _node))
			.filter(n => n.walkable);
		neighbors.forEach(n => n.costPrev = _node.costPrev + 1);
		return neighbors;
	}
	
	function isBlocWalkable(_coord) {
		var hasBomb = App.map.getEntitysAtBloc('bombs', _coord[0], _coord[1]).length > 0;
		return !hasBomb && App.map.isBlocAccessible(_coord[0], _coord[1])
	}
	
	_app.Ai.AStar = api;
	return _app;
})(App || {});


'use strict';

class Node {
	constructor(_x = 0, _y = 0, _walkable = 0, _prev = null) {
		this.x = _x;
		this.y = _y;
		this.walkable = _walkable;
		this.prevNode = _prev;
		this.costPrev = 0;
		this.isOpen = false;
		this.isClose = false;
	}
}