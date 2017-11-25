'use strict';

var App = (function(_app){
	var pool = {
		fire : [], 
		blast : [], 
	};
	
	var created = {
		fire : 0, 
	};
	
	var api = {
		get : function(_type) {
			var obj = pool[_type].pop();
			if (obj === undefined) {
				obj = createInstance(_type);
			}
			obj.rebuild();
			return obj;
		}, 
		
		save : function(_type, _obj) {
			pool[_type].push(_obj);
		}
	};
	
	function createInstance(_className) {
		created[_className] ++;
		var instance;
		switch (_className) {
			case 'fire':
				instance = new Fire();
			break;
			case 'blast':
				instance = new Blast();
			break;
		}
		return instance;
	}
	
	_app.Pool = api;
	return _app;
})(App || {});