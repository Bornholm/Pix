define(['core/subscriber'], function( Module ) {
	
	var History = Module.$extend({

		subs : {
			"project:active" : "_onActiveProjectChange",
			"menu:item:click" : "_onMenuItemClick"
		},

		start : function() {
			this.$super();
		},

		_onActiveProjectChange : function( project ) {
			this._activeProject = project;
		},

		_onMenuItemClick : function( item ) {
			if( item.id === 'undo' ) {
				this._undo();
			} else if ( item.id === 'redo' ) {
				this._redo();
			}
		},

		_undo : function() {
			var project = this._activeProject;
			if( project ) {
				project.undo();
			}
		},

		_redo : function() {
			var project = this._activeProject;
			if( project ) {
				project.redo();
			}
		}

	});

	return History;

});