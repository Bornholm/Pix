define(['core/subscriber'], function( Module ) {
	
	var Export = Module.$extend({

		subs : {
			'menu:item:click' : '_onMenuItemClick',
			'project:active' : '_onActiveProjectChange'
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