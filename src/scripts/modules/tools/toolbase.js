define(['core/subscriber'], function( Module ) {

	var ToolBase = Module.$extend({

		_toolDefinition : {
			id : "Tool's ID",
			label : "Tool's label",
			icon : "Tool's icon"
		},

		subs : {
			'project:active' : '_onActiveProjectChange',
			'toolbox:select' : '_onToolSelected'
		},

		start : function( opts ) {
			var self = this;
			self.$super( opts );
			self._isActive = false;
			self._toolOptions = $('<div />');
			self._registerTool();
		},

		_registerTool : function() {
			var self = this,
				def = self._toolDefinition;
			self.publish('toolbox:register', [ def.id, def.label, def.icon, self._toolOptions ] );
		},

		_onActiveProjectChange : function( project ) {
			var self = this;
			self.deactivate();
			self._activeProject = project;
			self._isActive && self.activate();
		},

		_onToolSelected : function( id ) {
			var self = this;
			if( id === self._toolDefinition.id ) {
				self._isActive = true;
				self.activate();
			} else {
				self._isActive = false;
				self.deactivate();
			}
		},

		activate : function() {
			console.log( "Activate", this._toolDefinition.id );
		},

		deactivate : function() {
			console.log( "Deactivate", this._toolDefinition.id );
		}

	});


	return ToolBase;

});