define( [
			'yajf/core', 

			// Main Menu
			'modules/menu',
			'modules/projectsmanager',
			'modules/export',

			// Tools
			'modules/tools',
			'modules/tools/pencil',

			// Extensions
			"extensions/pubsub",
			"extensions/panelmanager",
			"extensions/template" 
		], 
	function( Core, 
			MenuMod, ProjectsManMod, ExportMod,
			ToolsMod, PencilMod,
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
			self.registerModule( 'export', ExportMod );

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
							{ label : 'Export to PNG', id : 'export'  }
						]
					},
					{ 
						label : 'View',
						items : [
							{ label : 'Show Tools', id : 'toolset'  }
						]
					}

				]
			});

			// Starting Main Menu Handlers
			self.startModule( 'projects' );
			self.startModule( 'export' );

			// Starting Tools Modules
			self.startModule( 'tools' );
			self.startModule( 'pencil' );

		}

	});

	return Pix;
});