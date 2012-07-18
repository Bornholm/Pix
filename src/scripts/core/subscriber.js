define(['yajf/module', 'core/subscriber.mixin'], function( Module, SubsMixin ) {
	
	var Subscriber = Module.$extend({

		__include__ : [ SubsMixin ],

		__init__ : function( sandbox ) {
			this.$super( sandbox );
		},

		start : function( opts ) {
			this.$super( opts );
			this.addSubs();
		},

		stop : function( opts ) {
			this.removeSubs();
			this.$super( opts );
		},

	});

	return Subscriber;

});