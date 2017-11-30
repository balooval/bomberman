'use strict';

class Tween {
	constructor(_value = 0) {
		this.value = _value;
		this.valueStart = 0;
		this.valueEnd = 0;
		this.timeStart = -1;
		this.timeEnd = -1;
		this.timeTotal = -1;
		this.delta = 0;
		this.running = false;
		this.easeFunction = null;
		this.evt = new Evt();
		this.easing = {
			// no easing, no acceleration
			linear: function (t) { return t },
			// accelerating from zero velocity
			inQuad: function (t) { return t*t },
			// decelerating to zero velocity
			outQuad: function (t) { return t*(2-t) },
			// acceleration until halfway, then deceleration
			inOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
			// accelerating from zero velocity 
			inCubic: function (t) { return t*t*t },
			// decelerating to zero velocity 
			outCubic: function (t) { return (--t)*t*t+1 },
			// acceleration until halfway, then deceleration 
			inOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
			// accelerating from zero velocity 
			inQuart: function (t) { return t*t*t*t },
			// decelerating to zero velocity 
			outQuart: function (t) { return 1-(--t)*t*t*t },
			// acceleration until halfway, then deceleration
			inOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
			// accelerating from zero velocity
			inQuint: function (t) { return t*t*t*t*t },
			// decelerating to zero velocity
			outQuint: function (t) { return 1+(--t)*t*t*t*t },
			// acceleration until halfway, then deceleration 
			inOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }, 
			easeOutElastic : function(t){
				var p = 0.3;
				return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
			},
		};
	}
	
	setTargetValue(_value, _duration, _easeFn = null) {
		var curTime = Renderer.getCurFrame();
		this.valueStart = this.value;
		this.valueEnd = _value;
		this.easeFunction = _easeFn ? this.easing[_easeFn] : this.easing.outCubic;
		this.delta = this.valueEnd - this.valueStart;
		this.timeStart = curTime;
		this.timeEnd = curTime + _duration;
		this.timeTotal = this.timeEnd - this.timeStart;
		this.running = true;
	}
	
	getValueAtTime(_time) {
		this.timeTotal = this.timeEnd - this.timeStart;
		var timeElapsed = _time - this.timeStart;
		var timePrct = (timeElapsed / this.timeTotal);
		var delta = this.valueEnd - this.valueStart;
		// timePrct = this.easeFunction(timePrct);
		// this.value = this.valueStart + (this.delta * (timePrct));
		this.value = this.valueStart + (this.delta * this.easeFunction(timePrct));
		// this.value = this.valueStart + this.easeFunction(timePrct);
		if( timePrct >= 1 ){
			this.reachTargetValue();
		}
		return this.value;
	}

	reachTargetValue() {
		this.value = this.valueEnd;
		this.valueStart = this.valueEnd;
		this.timeEnd = -1;
		this.timeTotal = -1;
		this.running = false;
		this.evt.fireEvent( "END" );
	}
}