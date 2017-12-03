'use strict';

class IncentiveAttack extends Incentive {
	
	constructor(_bot, _factor) {
		super(_bot, _factor);
		this.name = 'Incentive Attack';
		this.targetJourney = null;
	}
	
	// Interface
	makeProposition() {
		this.score = 0;
		var targetPlayer = App.getPlayer(this.bot);
		if (targetPlayer === undefined) {
			return 0;
		}
		var targetBlocPos = targetPlayer.walker.blocPosition;
		this.targetJourney = App.map.getPathCoord(this.bot.walker.blocPosition, targetBlocPos);
		if (this.targetJourney.success) {
			this.score = (30 * this.factor) - this.targetJourney.steps;
		}
		return this.score;
	}
	
	// Interface
	tryProposition() {
		if (this.targetJourney.steps < 3) {
			this.bot.onPressDrop();
		} else {
			this.bot.journey = this.targetJourney;
			this.bot.onWalkerChangedBloc();
		}
		return true;
	}
}