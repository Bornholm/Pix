define( [	
			"core/subscriber",
			"core/pixelcanvas",
			"libs/text!modules/templates/newproject.tpl",
		], 
		function( Module, PixelCanvas, newProjectTemplate ) {

	var ProjectManager = Module.$extend({

		subs : {
			'menu:item:click' : '_onMenuItemClick',
			'tab:focus' : '_onTabFocus'
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

			var tab,
				self = this,
				tabMan = self.sandbox.tabsManager,
				dom = self._getProjectCreationDom();

			tab = tabMan.add( 'Create new project', dom, true );

			tab.content.on('click', '.cancel-button', self._onProjectCreationCancelation.bind( self, tab ) );
			tab.content.on('click', '.validate-button', self._onProjectCreationValidation.bind( self, tab ) );

		},

		_onProjectCreationCancelation : function( tab ) {
			var self = this,
				tabMan = self.sandbox.tabsManager;
			tabMan.remove( tab.id );
		},

		_onProjectCreationValidation : function( tab ) {

			var p, width, height, projectName,
				self = this,				
				tabMan = self.sandbox.tabsManager,
				params = tab.content.find('form').serializeArray(),
				len = params.length;

			while(len--) {
				p = params[len];
				p.name === "project" && (projectName = p.value);
				p.name === "width" && (width = +p.value);
				p.name === "height" && (height = +p.value);
			}

			self._createNewProject( tab, projectName, width, height );
		},

		_getProjectCreationDom : function() {
			return this.sandbox.template.render( newProjectTemplate );
		},

		_createNewProject : function( tab, projectName, width, height ) {

			var panel, project,
				self = this;

			project = new PixelCanvas({
				name : projectName,
				width : width,
				height : height
			});

			tab.content.empty();
			tab.content.append( project.el );

			tab.title.html( projectName );

			self._projects.push({
				tab : tab,
				project : project
			});

			self.publish( 'project:new' , [project] );
			self.publish( 'project:active', [project] );

			console.log(projectName, width, height);
		},


		_onTabFocus : function( tabId ) {

			var proj,
				self = this,
				projects = self._projects,
				len = projects.length;

			while(len--) {
				proj = projects[len];
				if( proj.tab.id === tabId ) {
					self.publish( 'project:active', [proj.project] );
					break;
				}
			}
			
		}

	});

	return ProjectManager;
});