define( [
			'yajf/core', 
			'modules/menu',
			'modules/projectsmanager',
			"extensions/pubsub",
			"extensions/panelmanager" 
		], 
	function( Core, 
			MenuMod, ProjectsManMod,
			PubSubExt, PanManMod ) {

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
			self.registerModule( 'menu', MenuMod );
			self.registerModule( 'projects', ProjectsManMod );
		},

		_registerExtensions : function() {
			var self = this;
			self.registerExtension( 'events', PubSubExt );
			self.registerExtension( 'panelsManager', PanManMod, {
				container : $('#workspace'),
				modalLayer : $('#modal')
			});
		},

		start : function() {
			var self = this;

			self.startModule( 'menu', {

				container : $("#main-menu"),
				items : [
					{ 
						label : 'Project',
						items : [
							{ label : 'New', id : "create-new" },
							{ label : 'Open', disabled : true },
							{ label : 'Save', disabled : true  },
							{ label : 'Export', disabled : true  }
						]
					},
					{ 
						label : 'Test',
						items : [
							{ label : 'T1', disabled : true  },
							{ label : 'T2', disabled : true  },
							{ label : 'T3', disabled : true  },
							{ label : 'T4', disabled : true  }
						]
					}

				]
			});

			self.startModule( 'projects' );


		}

	});

	return Pix;
});