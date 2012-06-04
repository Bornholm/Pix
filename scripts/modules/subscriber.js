define(['yajf/module'], function( Module ) {

	"use strict";
	
	return Module.$extend({

		subs : {},

		__init__ : function( sandbox ) {
			this.$super( sandbox );
			this.addSubs();
		},

		addSubs : function( subs ) {
			var method, methodName, eventName,
				self = this,
				pubsub = self.sandbox.events;
			subs = subs || self.subs;
			self.removeSubs();
			for ( eventName in subs ) {
				if( subs.hasOwnProperty( eventName ) ) {
					methodName = subs[ eventName ];
					method = self[ methodName ];
					if( !method ) throw new Error('Method "' + methodName + '" does not exist !');
					method =  pubsub.subscribe( eventName, method, self );
				}
			}

		},

		removeSubs :function( subs ) {
			var eventName, methodName, method,
				self = this,
				pubsub = self.sandbox.events;
			subs = subs || self.subs;
			for ( eventName in subs ) {
				if( subs.hasOwnProperty( eventName ) ) {
					methodName = subs[ eventName ];
					method = self[ methodName ];
					pubsub.unsubscribe( eventName, method );
				}
			}
		},

		publish : function() {
			this.sandbox.events.publish.apply( null, arguments );
		},

		subscribe : function() {
			this.sandbox.events.subscribe.apply( null, arguments );
		}

	})

});