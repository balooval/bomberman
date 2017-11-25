'use strict';

class Incentive {
	
	constructor(_bot, _factor = 1) {
	// Interface
		this.bot = _bot;
		this.factor = _factor;
		this.walker = this.bot.walker;
		this.score = 0;
		this.name = 'Incentive Interface';
	}
	
	// Interface
	makeProposition(_bot) {
		return 0;
	}
	
	// Interface
	tryProposition(_bot) {
		return false;
	}
}
