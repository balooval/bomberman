'use strict';

class Bomb extends Entity{
	constructor() {
		super(null, new THREE.SphereBufferGeometry(2, 8, 8 ));
		this.setLayer(Renderer.layers.hazard);
		this.setColor(0x500000);
		this.timeToLive = 180;
		this.explodeFrame = 0;
		this.damageBlocsDistance = 3;
		// new THREE.SphereBufferGeometry(5, 32, 32 );
	}
	
	ignite() {
		this.explodeFrame = Renderer.getCurFrame() + this.timeToLive;
		Renderer.evt.listen('RENDER_FRAME_' + this.explodeFrame, this, this.explode);
	}
	
	explode() {
		Renderer.evt.removeEventListener('RENDER_FRAME_' + this.explodeFrame, this, this.explode);
		App.map.removeBomb(this);
		this.addFire();
		
		// var ray = App.map.raycast(this.blocPosition, [1, 0], [this.damageBlocsDistance, 0]);
		// console.log('ray', ray);
		
		var walkerHited = this.getEntitiesHited('walkers');
		console.log('walkerHited', walkerHited);
		var bombsHited = this.getEntitiesHited('bombs').filter(b => b !== this);
		bombsHited.forEach(b => b.explode());
		this.dispose();
	}
	
	getEntitiesHited(_entitieType) {
		/*
		var squareXA = App.map.raycast(this.blocPosition, [1, 0], [this.damageBlocsDistance, 0]);
		var squareXB = App.map.raycast(this.blocPosition, [-1, 0], [this.damageBlocsDistance, 0]);
		var squareYA = App.map.raycast(this.blocPosition, [0, 1], [0, this.damageBlocsDistance]);
		var squareYB = App.map.raycast(this.blocPosition, [0, -1], [0, this.damageBlocsDistance]);
		console.log(squareXA);
		console.log(squareXB);
		console.log(squareYA);
		console.log(squareYB);
		var hits = App.map.getEntitiesInSquare(_entitieType, squareXA);
		hits = hits.concat(App.map.getEntitiesInSquare(_entitieType, squareXB));
		hits = hits.concat(App.map.getEntitiesInSquare(_entitieType, squareYA));
		hits = hits.concat(App.map.getEntitiesInSquare(_entitieType, squareYB));
		*/
		
		var hits = App.map.getEntitiesInSquare(_entitieType, this.getImpactBlocsRow());
		hits = hits.concat(App.map.getEntitiesInSquare(_entitieType, this.getImpactBlocsCol()));
		hits = [...new Set(hits)]
		return hits;
	}
	
	addFire() {
		var fireScale = (this.damageBlocsDistance * 2) + 1;
		var fireA = new Fire(fireScale, 1);
		fireA.setBlocPosition(this.blocPosition[0], this.blocPosition[1]);
		fireA.burn();
		var fireB = new Fire(1, fireScale);
		fireB.setBlocPosition(this.blocPosition[0], this.blocPosition[1]);
		fireB.burn();
	}
	
	getImpactBlocsCol() {
		return [
			this.blocPosition[0], 
			this.blocPosition[1] - this.damageBlocsDistance, 
			this.blocPosition[0], 
			this.blocPosition[1] + this.damageBlocsDistance, 
		]
	}
	
	getImpactBlocsRow() {
		return [
			this.blocPosition[0] - this.damageBlocsDistance, 
			this.blocPosition[1], 
			this.blocPosition[0] + this.damageBlocsDistance, 
			this.blocPosition[1], 
		]
	}
	
	dispose() {
		App.map.removeBomb(this);
		super.dispose();
	}
}