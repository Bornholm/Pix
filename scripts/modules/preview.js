define(['yajf/module'], function( Module ) {
	
	var Preview = Module.$extend({

		start : function() {
			var self = this;
			self._initEventsHandlers();
		},

		_initEventsHandlers : function() {

			var self = this,
				events = self.sandbox.events;

			events.subscribe( "menu:item:click", self._onMenuItemClick.bind( self ) );
			events.subscribe( "project:active", self._onActiveProjectChange.bind( self ) );
		},

		_onMenuItemClick : function( menuItem ) {
			if( menuItem.id === "preview" ) {
				this._showPreview();
			}
		},

		_onActiveProjectChange : function( project ) {
			var self = this;
			self._activeProject = project;
			self._updatePreview();
		},

		_showPreview : function() {

			var self = this,
				panel = self._panel,
				panels = self.sandbox.panelsManager;

			if( panel ) {
				panels.restore( panel );
			} else {
				panel = self._panel = panels.create( '', 'Project Preview', true );
			}

			self._updatePreview();
		},

		_updatePreview : function() {

			var self = this,
				project = self._activeProject,
				panel = self._panel;

			if( project && panel ) panel.content( project.getPreview() );
		}


	});

	return Preview;

});