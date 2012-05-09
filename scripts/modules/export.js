define(['yajf/module'], function( Module ) {
	
	var Export = Module.$extend({

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

		_onActiveProjectChange : function( project ) {
			this._activeProject = project;
		},

		_onMenuItemClick : function( menuItem ) {
			if( menuItem.id === "export" ) {
				this._exportActiveProject();
			}
		},

		_exportActiveProject : function() {
			var layers, len, l,
				canvas, context,
				dataUrl,
				self = this,
				project = self._activeProject;
			if( project ) {
				canvas = document.createElement('canvas');
				canvas.width = project.width();
				canvas.height = project.height();
				context = canvas.getContext('2d');
				layers = project.getLayers();
				len = layers.length;
				while(len--) {
					l = layers[len];
					context.drawImage( l.getCanvas(), 0, 0 );
				}
				dataUrl = canvas.toDataURL("image/png");
				window.open(dataUrl);
			} else {
				alert('None of your projects are belong to us !');
			}
		}

	});

	return Export;

});