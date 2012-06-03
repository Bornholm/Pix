define(['yajf/module', 'ui/colorpicker', 'ui/colorpalette'], function( Module, ColorPicker, ColorPalette ) {

	var ColorsModule = Module.$extend({

		start : function( opts ) {

			var self = this;

			opts = opts || {};
			self._container = opts.container;
			self._colors = [];

			self._initView();
			self._initEventsHandler();
			self._updateCurrentColor();
		},

		_initView : function() {

			var self = this,
				container = self._container,
				currentColor = $('<div />'),
				palette = new ColorPalette(),
				colorpicker = new ColorPicker();

			self._currentColor = currentColor;
			self._colorPicker = colorpicker;

			currentColor.addClass('current-color');

			container.append( colorpicker.el );
			container.append( currentColor );
			container.append( palette.el );
		},

		_initEventsHandler : function() {
			var self = this,
				cp = self._colorPicker,
				events = self.sandbox.events;

			events.subscribe('project:active', self._onActiveProjectChange.bind( self ) );
			cp.$el.on('colorpicker:change', self._colorPickerChangeHandler.bind( self ) );
		},

		_colorPickerChangeHandler : function( evt, hslString ) {
			var self = this,
				project = self._activeProject;
			if( project ) {
				project.color( hslString );
			}
			self._updateCurrentColor()
		},

		_onActiveProjectChange : function( project ) {
			var self = this,
				cp = self._colorPicker;
			self._activeProject = project;
			project.color( cp.toHSLString() );
		},

		_updateColorPickerColor : function() {
			var self = this,
				cp = self._colorPicker,
				project = self._activeProject;
			cp.fromColorString( project.color() );
			self._updateCurrentColor();
		},

		_updateCurrentColor : function() {
			var self = this,
				cp = self._colorPicker,
				currentColor = self._currentColor;
			currentColor.css( 'background-color', cp.toHSLString() );
		}



		

	});

	return ColorsModule;
	
});