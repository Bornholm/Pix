define( [
			'yajf/core', 
			'modules/menu',
			'modules/projectsmanager',
			'modules/tools',
			'modules/pencil',
			"extensions/pubsub",
			"extensions/panelmanager",
			"extensions/template" 
		], 
	function( Core, 
			MenuMod, ProjectsManMod, ToolsMod,
			PencilMod,
			PubSubExt, PanManExt, TemplateExt ) {

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

			// Tools
			self.registerModule( 'tools', ToolsMod );
			self.registerModule( 'pencil', PencilMod );

		},

		_registerExtensions : function() {
			var self = this;
			self.registerExtension( 'events', PubSubExt );
			self.registerExtension( 'panelsManager', PanManExt, {
				container : $('#workspace'),
				modalLayer : $('#modal'),
				bounds : {
					left : 0,
					top : 27,
					right : $(window).width(),
					bottom : $(window).height()
				}
			});
			self.registerExtension( 'template', TemplateExt );
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
						label : 'View',
						items : [
							{ label : 'Tools', id : 'toolset'  }
						]
					}

				]
			});

			self.startModule( 'projects' );

			self.startModule( 'tools' );
			self.startModule( 'pencil' );

		}

	});

	return Pix;
});