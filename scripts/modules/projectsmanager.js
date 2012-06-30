define( [	
			"core/subscriber",
			"core/pixelcanvas",
			"ui/panel",
			"libs/text!modules/templates/newproject.tpl",
		], 
		function( Module, PixelCanvas, Panel, newProjectTemplate ) {

	var ProjectManager = Module.$extend({


		subs : {
			'menu:item:click' : '_onMenuItemClick',
			'panel:focus' : '_onPanelFocus'
		},

		start : function() {
			var self = this;
			self._projects = [];
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

			panel = new Panel({
				title : 'Create new project',
				content : dom
			});

			panman.add( panel );
			panman.center( panel );
			panman.modal( panel );

			panel.$el.on('click', '.cancel-button', self._onProjectCreationCancelation.bind( self, panel ) );
			panel.$el.on('click', '.validate-button', self._onProjectCreationValidation.bind( self, panel ) );

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
				params = panel.$el.find('form').serializeArray(),
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
				panman = self.sandbox.panelsManager;

			project = new PixelCanvas({
				name : projectName,
				width : width,
				height : height
			});

			panel = new Panel({
				content : project.el,
				title : projectName
			});

			panman.add( panel, true );
			panman.maximize( panel );
			panman.draggable( panel );

			self._projects.push({
				panel : panel,
				project : project
			});

			self.publish( 'project:new' , [project] );

			console.log(projectName, width, height);
		},


		_onPanelFocus : function( panel ) {

			var proj,
				self = this,
				projects = self._projects,
				len = projects.length;

			while(len--) {
				proj = projects[len];
				if( proj.panel === panel ) {
					self.publish( 'project:active', [proj.project] );
					break;
				}
			}
			
		}

	});

	return ProjectManager;
});