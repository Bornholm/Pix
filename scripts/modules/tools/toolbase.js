define(['yajf/module'], function( Module ) {

	var ToolBase = Module.$extend({

		_toolDefinition : {
			id : "Tool's ID",
			label : "Tool's label",
			icon : "Tool's icon"
		},

		start : function( opts ) {
			var self = this;
			self._isActive = false;
			self._registerTool();
			self._initModulesEventsHandlers();
		},

		_registerTool : function() {
			var self = this,
				def = self._toolDefinition,
				events = self.sandbox.events;
			events.publish('tools:register', [ def.id, def.label, def.icon ] );
		},

		_initModulesEventsHandlers : function() {
			var self = this,
				events = self.sandbox.events;
			events.subscribe('project:active', self._onActiveProjectChange.bind( self ) );
			events.subscribe('tools:select', self._onToolSelected.bind( self ) );
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