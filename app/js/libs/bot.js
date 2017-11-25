'use strict';

class Bot extends Player {
	
	constructor(_walker, _name) {
		super(_walker, _name);
		this.walker = _walker;
		this.journey = {path:[], length:0};
		this.walker.evt.listen('CHANGED_BLOC', this, this.onWalkerChangedBloc);
		this.persona = App.Persona.getBestStored();
		this.incentives = [
			new IncentiveBonus(this, this.persona.bonus), 
			new IncentiveExplore(this, this.persona.explore), 
			new IncentiveAttack(this, this.persona.attack), 
			new IncentiveSafe(this, this.persona.safe), 
		];
		this.frameIncentiveUpdate = 0;
		this.listenToNextIncentiveUpdate();
		this.onWalkerChangedBloc();
	}
	
	kill() {
		var remainingPlayersNb = App.getPlayerList().length;
		// console.log('remainingPlayersNb', remainingPlayersNb);
		App.Persona.storePersona(this.persona, 4 - remainingPlayersNb);
		super.kill();
	}
	
	listenToNextIncentiveUpdate() {
		Renderer.evt.removeEventListener('RENDER_FRAME_' + this.frameIncentiveUpdate, this, this.listenToNextIncentiveUpdate);
		this.frameIncentiveUpdate = Renderer.getCurFrame() + 60;
		Renderer.evt.listen('RENDER_FRAME_' + this.frameIncentiveUpdate, this, this.listenToNextIncentiveUpdate);

		this.incentives.forEach(i => i.makeProposition());
		var bestIncentive = this.incentives
			.sort((a, b) => a.score > b.score)
			.filter(i => i.score > 0)
			.pop();
		if (bestIncentive) {
			bestIncentive.tryProposition();
		}
	}
	
	getPathToBonus() {
		var bonus = App.map.getSomeBonus();
		if (bonus === null) {
			return this.getPathToHuman();
		}
		return App.map.getPathCoord(this.walker.blocPosition, bonus.blocPosition);
	}
	
	getPathToHuman() {
		return App.map.getPathCoord(this.walker.blocPosition, App.getPlayer(this.walker).walker.blocPosition);
	}
	
	getNextBlocDest() {
		if (this.journey.path.length == 0) {
			return null;
		}
		return this.journey.path.shift();
	}
	
	onWalkerChangedBloc() {
		this.releaseAllButtons();
		var nextBloc = this.getNextBlocDest();
		if (nextBloc === null) {
			return false;
		}
		var curPos = this.walker.blocPosition;
		if (curPos[0] < nextBloc.x) {
			this.onPressRight();
		} else if (curPos[0] > nextBloc.x) {
			this.onPressLeft();
		} else if (curPos[1] < nextBloc.y) {
			this.onPressDown();
		} else if (curPos[1] > nextBloc.y) {
			this.onPressUp();
		}
	}
	
	releaseAllButtons() {
		this.onReleaseLeft();
		this.onReleaseRight();
		this.onReleaseDown();
		this.onReleaseUp();
	}
	
	dispose() {
		Renderer.evt.removeEventListener('RENDER_FRAME_' + this.frameIncentiveUpdate, this, this.listenToNextIncentiveUpdate);
	}
}