define( ["yajf/extension"], function( Extension ) {

	//From https://github.com/daniellmb/MinPubSub

	var PubSubExt = Extension.$extend({

		getSandboxExtension : function() {

			var cache = {};

			return {

				publish : function( topic, args ) {
					var subs = cache[topic],
						len = subs ? subs.length : 0;
					while( len-- ){
						subs[len].callback.apply( subs[len].context, args || [] ); 
					}
					console.log(topic, args);
				},

				subscribe : function( topic, callback, context ) {
					!cache[topic] && ( cache[topic] = [] );
					cache[topic].push({ context : context, callback : callback });
				},

				unsubscribe : function( topic, callback ) {
					var subs = cache[topic],
						len = subs ? subs.length : 0;
					while( len-- ){
						subs[len] === callback && subs.splice(len, 1);
					}
				}

			}

		}

	});

	return PubSubExt;

});