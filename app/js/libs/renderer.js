'use strict';

var Renderer = (function(){
	var scene;
    var myRenderer;
	var camera;
	var elmt;
	var frameId = 0;
	
	var api = {
		evt : null, 
		layers : {
			background : 0, 
			hazard : 0.1, 
			effects : 0.2, 
			player : 0.3, 
		}, 
		
		init : function(_elmt) {
			elmt = _elmt;
			api.evt = new Evt();
			myRenderer = new THREE.WebGLRenderer();
			myRenderer.setClearColor(0xaec8e2);
			elmt.appendChild(myRenderer.domElement);
			window.onresize = onResize;
			var grid = new THREE.GridHelper(100, 10);
			camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000);
			camera.position.x = 0;
			camera.position.y = 60;
			camera.position.z = 10;
			camera.lookAt(grid.position);
			scene = new THREE.Scene();
			scene.add(camera);
			scene.add(grid);
			onResize();
		}, 
		
		play : function() {
			animate();
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
	};
	
	function onResize() {
		myRenderer.setSize(elmt.clientWidth, elmt.clientHeight);
		camera.aspect = elmt.clientWidth / elmt.clientHeight;
		camera.updateProjectionMatrix();
	};
	
	function animate() {
		frameId ++;
		api.evt.fireEvent('RENDER');
		api.evt.fireEvent('RENDER_FRAME_' + frameId);
		myRenderer.render(scene, camera);
        requestAnimationFrame(animate, myRenderer.domElement);
    }
	
	return api;
})();