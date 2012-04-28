define( [
			'yajf/core', 
			'modules/menu', 
			"extensions/pubsub",
			"extensions/underscore" 
		], 
	function( Core, MenuMod, PubSubExt, UnderscoreExt ) {

	var Pix = Core.$extend({

		__init__ : function( opts ) {

			var self = this;
			this.$super( opts )

			opts = opts || {};			

			self._registerExtensions();
			self._registerModules();
			
		},

		_registerModules : function() {
			var self = this;
			self.registerModule('menu', MenuMod);
		},

		_registerExtensions : function() {
			var self = this;
			self.registerExtension( 'events', PubSubExt );
			self.registerExtension( '_', UnderscoreExt );
		},

		start : function() {
			var self = this;

			self.startModule( 'menu', {

				container : $("#main-menu"),
				items : [
					{ 
						label : 'File',
						items : [
							{ label : 'New' },
							{ label : 'Open' },
							{ label : 'Save' }
						]
					},
					{ 
						label : 'Test',
						items : [
							{ label : 'T1' },
							{ label : 'T2' },
							{ label : 'T3' },
							{ label : 'T4' }
						]
					}

				]
			});
		}

	});

	return Pix;
});