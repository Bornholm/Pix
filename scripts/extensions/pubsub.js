define( ["yajf/extension"], function( Extension ) {

	//From https://github.com/daniellmb/MinPubSub

	var PubSubExt = Extension.$extend({

		getSandboxExtension : function() {

			var cache = {};

			return {

				publish : function( topic, args ) {
					var subs = cache[topic],
						len = subs ? subs.length : 0;
					//can change loop or reverse array if the order matters
					while( len-- ){ 
						subs[len].apply( null, args || [] ); 
					}
				},

				subscribe : function( topic, callback ) {
					!cache[topic] && ( cache[topic] = [] );
					cache[topic].push(callback);
					return [topic, callback];
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