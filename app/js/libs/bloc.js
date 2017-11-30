'use strict';

class Bloc{
	
	static getType(_type) {
		var types = {
			ground : {
				typeId : 0, 
				cost : 0, 
				// color: 0xffe6e4, 
				color: 0xffffff, 
				texture : 'grass', 
				model : 'bloc', 
				blockFlame : false, 
				destoyable : false, 
				height : 0.1, 
			}, 
			core : {
				typeId : 1, 
				cost : -1, 
				color: 0xffffff, 
				texture : 'rock', 
				model : 'rock', 
				blockFlame : true, 
				destoyable : false, 
				height : 1, 
			}, 
			basic : {
				typeId : 2, 
				cost : -1, 
				// color: 0xfced7a, 
				color: 0xffffff, 
				texture : 'buisson', 
				model : 'buisson', 
				blockFlame : true, 
				destoyable : true, 
				height : 1, 
			}
		}
		return types[_type];
	}
	
	constructor(_type, _x, _y) {
		var type = Bloc.getType(_type);
		this.blockFlame = type.blockFlame;
		this.coord = [_x, _y];
		var material = new THREE.MeshStandardMaterial({
			map : App.Assets.Textures.get(type.texture),
			color : 0xffffff, 
			metalness : 0, 
			roughness : 1, 
		});
		this.entity = new Entity(material);
		this.type = type;
		if (type.typeId > 0) {
			var angle = Math.PI / 2;
			var nb = Math.random() * 4
			var rot = angle * Math.floor(nb);
			this.entity.setRotation(0, rot, 0);
		}
		this.cost = type.cost;
		this.entity.setBlocPosition(this.coord[0], this.coord[1]);
		this.entity.setColor(this.type.color);
		this.entity.setSize(1, this.type.height, 1);
		this.entity.setModel(this.type.model);
		this.entity.setDirection([0, 0]);
		
		if (type.typeId == 10 || type.typeId == 1) {
			if (type.typeId == 10) {
				App.map.groundEntity.merge(this.entity, this.coord);
			}
			if (type.typeId == 1) {
				App.map.wallsEntity.merge(this.entity, this.coord);
			}
			this.entity.mesh.geometry.dispose();
			this.entity.mesh.material.dispose();
			this.entity.dispose();
			this.entity = null;
		}
	}
	
	chooseBonus() {
		if (Math.random() < 0.5) {
			return null;
		}
		var bonus = new Bonus();
		return bonus;
	}
	
	dropBonus() {
		var bonus = this.chooseBonus()
		if (bonus === null) {
			return false;
		}
		bonus.setBlocPosition(this.coord[0], this.coord[1]);
		App.map.addBonus(bonus);
	}
	
	destroy() {
		App.map.removeBloc(this.coord[0], this.coord[1]);
		this.dropBonus();
		this.dispose();
	}
	
	dispose() {
		if (this.entity) {
			this.entity.dispose();
		}
	}
}