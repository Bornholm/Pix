define(['yajf/module', 'core/subscriber.mixin'], function( Module, SubsMixin ) {
	
	var Subscriber = Module.$extend({

		__include__ : [ SubsMixin ],

		__init__ : function( sandbox ) {
			this.$super( sandbox );
			this.addSubs();
		}

	});

	return Subscriber;

});