'use strict';

class Bloc extends Entity{
	
	static getType(_type) {
		var types = {
			ground : {
				typeId : 0, 
				cost : 0, 
				color: 0xffe6e4, 
				texture : 'ground', 
				model : 'bloc', 
				blockFlame : false, 
				destoyable : false, 
				height : 0.1, 
			}, 
			core : {
				typeId : 1, 
				cost : -1, 
				color: 0x92c0e8, 
				texture : 'bloc', 
				model : 'bloc', 
				blockFlame : true, 
				destoyable : false, 
				height : 1, 
			}, 
			basic : {
				typeId : 2, 
				cost : -1, 
				color: 0xfced7a, 
				texture : 'bloc-2', 
				model : 'bloc-soft', 
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
			// map : App.Assets.Textures.get(type.texture),
			color : 0xffffff, 
			metalness : 0, 
			roughness : 1, 
		});
		
		// material = new THREE.MeshBasicMaterial({map:App.Assets.Textures.get(type.texture)});
		super(material);
		this.type = type;
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