'use strict';

class IncentiveExplore extends Incentive {
	
	constructor(_bot, _factor) {
		super(_bot, _factor);
		this.name = 'Incentive Explore';
		this.blocTypeSearched = 2;
		this.exploreJourney = null;
	}
	
	makeProposition() {
		var curCoord = this.bot.walker.blocPosition;
		this.score = 0;
		this.exploreJourney = App.map.getPathBlocType(curCoord, this.blocTypeSearched);
		if (this.exploreJourney.success) {
			this.score = Math.max((5 * this.factor) - this.exploreJourney.steps, 1);
		}
		return this.score;
	}
	
	tryProposition() {
		if (App.map.hasNeigbourgTypeOf(this.bot.walker.blocPosition, this.blocTypeSearched)) {
			this.bot.onPressDrop();
			return true;
		}
		this.bot.journey = this.exploreJourney;
		this.bot.onWalkerChangedBloc();
		return true;
	}
}