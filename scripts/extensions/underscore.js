define( ["yajf/extension", 'libs/underscore-min'], function( Extension ) {

	var Underscore = Extension.$extend({
		getSandboxExtension : function() {
			return _.noConflict();
		}
	});


	return Underscore;

});