'use strict';

var App = (function(_app){
	_app.UI = _app.UI || {};
	
	var mainId = 'ui-modal';
	var mainElmt = null;
	
	var api = {
		
		init : function() {
			mainElmt = App.UI.gebi(mainId);
		}, 
		
		setHtml : function(_html) {
			mainElmt.innerHTML = _html;
			mainElmt.classList.add('active');
		}, 
		
		clear : function() {
			mainElmt.innerHTML = '';
			mainElmt.classList.remove('active');
		}, 
		
	};
	
	_app.UI.Modal = api;
	return _app;
})(App || {});