'use strict';

class IncentiveBonus extends Incentive {
	
	constructor(_bot) {
		super(_bot);
		this.name = 'Incentive Bonus';
		this.blocTypeSearched = 2;
		this.bonusJourney = null;
	}
	
	makeProposition() {
		var curCoord = this.bot.walker.blocPosition;
		this.score = 0;
		this.bonusJourney = App.map.getPathToEntity(curCoord, 'bonus');
		if (this.bonusJourney.success) {
			this.score = (8 * this.factor) - this.bonusJourney.steps;
		}
		return this.score;
	}
	
	tryProposition() {
		this.bot.journey = this.bonusJourney;
		this.bot.onWalkerChangedBloc();
		return true;
	}
}