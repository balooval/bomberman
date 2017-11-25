'use strict';

class IncentiveSafe extends Incentive {
	
	constructor(_bot) {
		super(_bot);
		this.name = 'Incentive Safe';
		this.safeJourney = null;
	}
	
	makeProposition() {
		var curCoord = this.bot.walker.blocPosition;
		this.score = 0;
		if (App.map.getDangerAtCoord(curCoord) == 0) {
			return 0;
		}
		this.safeJourney = App.map.getPathSafe(curCoord);
		// console.log('EN DANGER', this.safeJourney);
		if (App.map.getDangerAtCoord(this.safeJourney.dest) > 0) {
			return 0;
		}
		this.score = 50 * this.factor;
		return this.score;
	}
	
	tryProposition() {
		this.bot.journey = this.safeJourney;
		this.bot.onWalkerChangedBloc();
		return true;
	}
}