'use strict';

var Renderer = (function(){
	var scene;
    var myRenderer;
	var camera;
	var elmt;
	var frameId = 0;
	var grid;
	
	var api = {
		evt : null, 
		layers : {
			background : 0, 
			hazard : 0, 
			items : 0, 
			effects : 0, 
			player : 0, 
			front : 5, 
		}, 
		
		moveCamera(x, y, z) {
			camera.position.x += x;
			camera.position.y += y;
			camera.position.z += z;
			camera.lookAt(grid.position);
		}, 
		
		init : function(_elmt) {
			elmt = _elmt;
			api.evt = new Evt();
			myRenderer = new THREE.WebGLRenderer();
			// myRenderer.setClearColor(0xaec8e2);
			myRenderer.setClearColor(0xd06fa4);
			elmt.appendChild(myRenderer.domElement);
			window.onresize = onResize;
			grid = new THREE.GridHelper(100, 10);
			camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000);
			camera.position.x = 0;
			camera.position.y = 65;
			camera.position.z = 15;
			camera.lookAt(grid.position);
			scene = new THREE.Scene();
			scene.add(camera);
			// scene.add(grid);
			onResize();
		}, 
		
		play : function() {
			api.renderNextFrame();
		}, 
		
		addToScene : function(_obj) {
			scene.add(_obj);
		}, 
		
		addEntity : function(_entity) {
			scene.add(_entity.mesh);
		}, 
		
		removeEntity : function(_entity) {
			scene.remove(_entity.mesh);
		}, 
		
		getCurFrame : function() {
			return frameId;
		}, 
		
		renderNextFrame : function() {
			frameId ++;
			api.evt.fireEvent('RENDER');
			api.evt.fireEvent('RENDER_FRAME_' + frameId);
			myRenderer.render(scene, camera);
		}, 
	};
	
	function onResize() {
		myRenderer.setSize(elmt.clientWidth, elmt.clientHeight);
		camera.aspect = elmt.clientWidth / elmt.clientHeight;
		camera.updateProjectionMatrix();
	};
	
	return api;
})();