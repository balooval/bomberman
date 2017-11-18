'use strict';

var Debug = (function() {
	
	var api = {
		set : function(_id, _msg) {
			document.getElementById(_id).innerHTML = _msg;
		}, 
	};
	
	return api;
    
})();