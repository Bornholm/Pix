define( ['libs/classy'], function( Class ) {

	var Module = Class.$extend({

		__init__ : function( sandbox ) {
			this.sandbox = sandbox;
		},

		stop : function( opts ) {},

		start : function( opts ) {}

	});

	return Module;
	
});