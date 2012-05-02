define( [	
			"yajf/module",
			"libs/mustache",
			"libs/text!modules/templates/newproject.tpl",
			"libs/zepto.min"
		], 
		function( Module, Mustache, newProjectTemplate ) {

	var New = Module.$extend({

		start : function() {
			var self = this;

			self._initEventsHandlers();
		},

		_initEventsHandlers : function() {

			var self = this,
				events = self.sandbox.events;

			events.subscribe( "menu:item:click", self._onMenuItemClick.bind( self ) ); 
		},

		_onMenuItemClick : function( menuItem ) {
			var self = this;
			if( menuItem.id === "create-new" ) {
				self._showProjectCreationPanel();
			}
		},

		_showProjectCreationPanel : function() {

			var panel,
				self = this,
				panman = self.sandbox.panelsManager,
				dom = self._getProjectCreationDom();

			panel = panman.addPanel( dom, '<span>Create new project</span>',  false, true );

			panel.el.on('click', '.cancel-button', self._onProjectCreationCancelation.bind( self, panel ) );
			panel.el.on('click', '.validate-button', self._onProjectCreationValidation.bind( self, panel ) );

		},

		_onProjectCreationCancelation : function( panel ) {
			var self = this,
				panman = self.sandbox.panelsManager;
			panman.removePanel( panel );
		},

		_onProjectCreationValidation : function( panel ) {

			var p, width, height, projectName,
				self = this,				
				panman = self.sandbox.panelsManager,
				params = panel.el.find('form').serializeArray(),
				len = params.length;

			while(len--) {
				p = params[len];
				p.name === "project" && (projectName = p.value);
				p.name === "width" && (width = +p.value);
				p.name === "height" && (height = +p.value);
			}

			panman.removePanel( panel );

			self._createNewProject( projectName, width, height );
		},

		_getProjectCreationDom : function() {
			return Mustache.render( newProjectTemplate );
		},

		_createNewProject : function( projectName, width, height ) {

			var panel,
				self = this,
				panman = self.sandbox.panelsManager;

			panel = panman.addPanel( "<canvas></canvas>", '<span>'+projectName+'</span>',  true );

			console.log(projectName, width, height);
		}

	});

	return New;
});