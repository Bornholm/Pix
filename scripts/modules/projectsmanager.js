define( [	
			"yajf/module",
			"core/pixelcanvas",
			"libs/text!modules/templates/newproject.tpl",
			"libs/zepto.min"
		], 
		function( Module, PixelCanvas, newProjectTemplate ) {

	var ProjectManager = Module.$extend({

		start : function() {
			var self = this;
			self._projects = [];
			self._initEventsHandlers();
		},

		_initEventsHandlers : function() {

			var self = this,
				events = self.sandbox.events;

			events.subscribe( "menu:item:click", self._onMenuItemClick.bind( self ) );
			events.subscribe( "panel:focus", self._onPanelFocus.bind( self ) );
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

			panel = panman.create( dom, '<span>Create new project</span>',  false, true );

			panel.el.on('click', '.cancel-button', self._onProjectCreationCancelation.bind( self, panel ) );
			panel.el.on('click', '.validate-button', self._onProjectCreationValidation.bind( self, panel ) );

		},

		_onProjectCreationCancelation : function( panel ) {
			var self = this,
				panman = self.sandbox.panelsManager;
			panman.remove( panel );
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

			panman.remove( panel );

			self._createNewProject( projectName, width, height );
		},

		_getProjectCreationDom : function() {
			return this.sandbox.template.render( newProjectTemplate );
		},

		_createNewProject : function( projectName, width, height ) {

			var panel, project,
				self = this,
				events = self.sandbox.events,
				panman = self.sandbox.panelsManager;

			project = new PixelCanvas({
				name : projectName,
				width : width,
				height : height
			});

			panel = panman.create( project.el , '<span>'+projectName+'</span>',  true );

			self._projects.push({
				panel : panel,
				project : project
			});

			events.publish( 'project:new' , [project] );

			console.log(projectName, width, height);
		},


		_onPanelFocus : function( panel ) {

			var proj,
				self = this,
				projects = self._projects,
				len = projects.length,
				events = self.sandbox.events;

			while(len--) {
				proj = projects[len];
				if( proj.panel === panel ) {
					events.publish( 'project:active', [proj.project] );
					break;
				}
			}
			
		}

	});

	return ProjectManager;
});