define(['core/subscriber', 'ui/colorpicker', 'ui/colorpalette'], function( Module, ColorPicker, ColorPalette ) {

	var ColorsModule = Module.$extend({

		subs : {
			'project:active' : '_onActiveProjectChange'
		},

		start : function( opts ) {

			var self = this;

			opts = opts || {};
			self._container = $(opts.container);
			self._colors = [];

			self._initView();
			self._initEventsHandler();
			self._onPixelCanvasChangeBinded = self._onPixelCanvasChange.bind( self );
		},

		_initView : function() {

			var self = this,
				container = self._container,
				palette = new ColorPalette(),
				colorpicker = new ColorPicker();

			self._colorpicker = colorpicker;
			self._palette = palette;

			container.append( colorpicker.el );
			container.append( palette.el );
		},

		_initEventsHandler : function() {
			var self = this,
				container = self._container;
			container.on('colorpicker:change', '.ui-widget.colorpicker', self._colorPickerChangeHandler.bind( self ) );
			container.on('colorpalette:select', '.ui-widget.colorpalette', self._onPaletteSelection.bind( self ) );
		},

		_colorPickerChangeHandler : function( evt, color ) {
			var self = this,
				project = self._activeProject;
			project && project.color( color );
		},

		_onPaletteSelection : function( evt, color ) {
			this._colorpicker.color( color );
		},

		_onActiveProjectChange : function( project ) {

			var self = this,
				cp = self._colorpicker;
			self._activeProject &&	self._activeProject.$el.off( 'pixelcanvas:change', self._onPixelCanvasChangeBinded );
			self._activeProject = project;
			project.$el.on( 'pixelcanvas:change', self._onPixelCanvasChangeBinded );
			project.color( cp.color() );
		},

		_onPixelCanvasChange : function() {
			var self = this,
				project = self._activeProject;
			self._palette.addColor( project.color() );
		}

	});

	return ColorsModule;
	
});