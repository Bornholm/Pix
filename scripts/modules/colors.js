define(['modules/subscriber', 'ui/colorpicker', 'ui/colorpalette'], function( Module, ColorPicker, ColorPalette ) {

	var ColorsModule = Module.$extend({

		subs : {
			'project:active' : '_onActiveProjectChange'
		},

		start : function( opts ) {

			var self = this;

			opts = opts || {};
			self._container = opts.container;
			self._colors = [];

			self._initView();
			self._initEventsHandler();
		},

		_initView : function() {

			var self = this,
				container = self._container,
				palette = new ColorPalette(),
				colorpicker = new ColorPicker();

			self._colorPicker = colorpicker;

			container.append( colorpicker.el );
			container.append( palette.el );
		},

		_initEventsHandler : function() {
			var self = this,
				cp = self._colorPicker,
				events = self.sandbox.events;
			cp.$el.on('colorpicker:change', self._colorPickerChangeHandler.bind( self ) );
		},

		_colorPickerChangeHandler : function( evt, hslaString ) {
			var self = this,
				project = self._activeProject;
			if( project ) {
				project.color( hslaString );
			}
		},

		_onActiveProjectChange : function( project ) {
			var self = this,
				cp = self._colorPicker;
			self._activeProject = project;
			project.color( cp.toHSLAString() );
		},

		_updateColorPickerColor : function() {
			var self = this,
				cp = self._colorPicker,
				project = self._activeProject;
			cp.fromColorString( project.color() );
		}

	});

	return ColorsModule;
	
});