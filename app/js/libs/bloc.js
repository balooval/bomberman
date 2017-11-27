'use strict';

class Bloc extends Entity{
	
	static getType(_type) {
		var types = {
			ground : {
				typeId : 0, 
				cost : 0, 
				color: 0xffe6e4, 
				// texture : 'ground', 
				texture : null, 
				model : 'bloc', 
				blockFlame : false, 
				destoyable : false, 
				height : 0.1, 
			}, 
			core : {
				typeId : 1, 
				cost : -1, 
				// color: 0x92c0e8, 
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
				color: 0xfced7a, 
				// texture : 'bloc-2', 
				texture : null, 
				// model : 'bloc-soft', 
				model : 'bloc', 
				blockFlame : true, 
				destoyable : true, 
				height : 1, 
			}
		}
		return types[_type];
	}
	
	constructor(_type) {
		var type = Bloc.getType(_type);
		var material = null;
		material = new THREE.MeshStandardMaterial({
			map : App.Assets.Textures.get(type.texture),
			color : 0xffffff, 
			metalness : 0, 
			roughness : 1, 
		});
		
		super(material);
		this.type = type;
		if (type.typeId == 1) {
			var angle = Math.PI / 2;
			var nb = Math.random() * 4
			var rot = angle * Math.floor(nb);
			this.setRotation(0, rot, 0);
		}
		this.blockFlame = type.blockFlame;
		this.cost = type.cost;
		this.setLayer(Renderer.layers.background);
		this.setColor(this.type.color);
		this.setSize(1, this.type.height, 1);
		this.setModel(this.type.model);
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
		bonus.setBlocPosition(this.blocPosition[0], this.blocPosition[1]);
		App.map.addBonus(bonus);
	}
	
	destroy() {
		App.map.removeBloc(this.blocPosition[0], this.blocPosition[1]);
		this.dropBonus();
		this.dispose();
	}
	
}