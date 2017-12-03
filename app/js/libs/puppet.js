'use strict';

class Puppet {
	constructor() {
		this.curAnimation = null;
		this.animations = {};
	}
	
	addAnimation(_name, _animation) {
		this.animations[_name] = _animation;
	}
	
	play(_name) {
		this.curAnimation = this.animations[_name];
		this.curAnimation.play();
	}
	
	getValues(_frameId) {
		return this.curAnimation.getAllValues(_frameId);
	}
}

class Animation {
	constructor() {
		this.nextId = 0;
		this.timelines = [];
	}
	
	addTimeline(_name, _values, _durations, _easing) {
		var curId = this.nextId;
		this.timelines.push({
			id : curId, 
			name : _name, 
			currentFrame : 0, 
			framesNb : _values.length, 
			durations : _durations, 
			values : _values, 
			ease : _easing, 
			tween : new Tween(), 
		});
		this.nextId ++;
		return curId;
	}
	
	play() {
		var timelinesToRun = this.getValidTimelines();
		if (timelinesToRun.length == 0) {
			return false;
		}
		// timelinesToRun.forEach(a => a.tween.evt.listen('END', this, this.onReachFrame));
		timelinesToRun.forEach(a => this.onReachFrame(a.tween));
	}
	
	getAllValues(_frameId) {
		return this.timelines.reduce((prev, t) => {
			prev[t.name] = t.tween.getValueAtTime(_frameId);
			return prev;
		}, {});
	}
	
	getValue(_timelineId, _frameId) {
		return this.getTimelineById(_timelineId).tween.getValueAtTime(_frameId);
	}
	
	onReachFrame(_tween) {
		var curTimeline = this.getTimelineByTween(_tween);
		curTimeline.tween.evt.removeEventListener('END', this, this.onReachFrame);
		this.stepNextFrame(curTimeline);
		var frameProps = this.getTimelineFrame(curTimeline);
		curTimeline.tween.setTargetValue(frameProps.value, frameProps.duration, frameProps.ease);
		curTimeline.tween.evt.listen('END', this, this.onReachFrame);
	}
	
	getValidTimelines() {
		return this.timelines.filter(a => a.framesNb > 0);
	}
	
	getTimelineById(_id) {
		return this.timelines.filter(a => a.id == _id).pop();
	}
	
	getTimelineByTween(_tween) {
		return this.timelines.filter(a => a.tween == _tween).pop();
	}
	
	getTimelineFrame(_timeline) {
		var curFrame = _timeline.currentFrame
		return {
			duration : _timeline.durations[curFrame], 
			value : _timeline.values[curFrame], 
			ease : _timeline.ease[curFrame], 
		}
	}
	
	stepNextFrame(_timeline) {
		_timeline.currentFrame ++;
		_timeline.currentFrame =  _timeline.currentFrame % _timeline.framesNb;
	}
	
}