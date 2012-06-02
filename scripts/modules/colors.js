define(['yajf/module', 'ui/colorpicker'], function( Module, ColorPicker ) {

	var ColorsModule = Module.$extend({

		start : function( opts ) {

			var self = this;

			opts = opts || {};
			self._container = opts.container;

			self.render();
			self._initEventsHandler();
		},

		render : function() {

			var self = this,
				container = self._container,
				colorpicker = new ColorPicker();

			self._colorPicker = colorpicker;

			container.append( colorpicker.el );
		},

		_initEventsHandler : function() {
			var self = this,
				cp = self._colorPicker,
				events = self.sandbox.events;

			events.subscribe('project:active', self._onActiveProjectChange.bind( self ) );

			cp.$el.on('colorpicker:change', self._colorPickerChangeHandler.bind( self ) );
		},

		_colorPickerChangeHandler : function( evt, hslString ) {
			var project = this._activeProject;
			if( project ) {
				project.color( hslString );
			}
		},

		_onActiveProjectChange : function( project ) {
			var self = this;
			self._activeProject = project;
			self._updateColorPickerColor();
		},

		_updateColorPickerColor : function() {
			var self = this,
				cp = self._colorPicker,
				project = self._activeProject;
		},

		_updateProjectColor : function() {
			var self = this,
				cp = self._colorPicker,
				project = self._activeProject;
			project.color( cp.toHSLString() );
		}


		

	});

	return ColorsModule;
	
});