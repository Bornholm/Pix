define(['core/subscriber', 'ui/colorpicker', 'ui/colorpalette'], function( Module, ColorPicker, ColorPalette ) {

	var ColorsModule = Module.$extend({

		subs : {
			'project:active' : '_onActiveProjectChange',
			'color:use' : '_onColorUse'
		},

		start : function( opts ) {

			var self = this;

			opts = opts || {};
			self.$super( opts );

			self._container = $(opts.container);

			self._initView();
			self._initEventsHandler();
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
			var events = this.sandbox.events;
			events.publish( "color:selected", [color] );
		},

		_onPaletteSelection : function( evt, color ) {
			this._colorpicker.color( color );
		},

		_onActiveProjectChange : function( project ) {
			var self = this,
				cp = self._colorpicker;
			self._activeProject &&	self._activeProject.$el.off( 'pixelcanvas:change', self._onPixelCanvasChangeBinded );
			self._activeProject = project;
		},

		_onColorUse : function( color ) {
			this._palette.addColor( color );
		}

	});

	return ColorsModule;
	
});