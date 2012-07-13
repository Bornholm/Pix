define( ['libs/classy'], function( Class ) {

	var Extension = Class.$extend({

		__init__ : function( sandbox ) {
			this.sandbox = sandbox;
		},

		getSandboxExtension : function( sandbox ) {
			throw "You must override getSandboxExtension method !"
		}

	});

	return Extension;
	
});