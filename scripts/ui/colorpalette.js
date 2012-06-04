define(['ui/widget'], function( Widget ){

	var ColorPalette = Widget.$extend({

		widgetClass : 'palette',

		events : {
			'click .color' : '_onColorClick'
		},

		__init__ : function() {
			var self = this;
			self._colors = [];
			self.$super();
			self._update();
		},

		_update : function() {
			var i, curr,
				elements = [],
				self = this,
				colors = self._colors,
				len = colors.length,
				el = self.$el;

			for ( i = 0; i < len; ++i ) {
				curr = document.createElement('div');
				curr.className = 'color';
				curr.style['background-color'] = colors[i];
				elements.push( curr );
			}

			elements.length > 0 && el.html( elements );
		},

		_onColorClick : function( evt ) {
			var target = $(evt.currentTarget),
				color = target.css('background-color');
			this.$el.trigger( 'palette:select', [ color ] );
		},

		addColor : function( clrString ) {
			var self = this;
			if( !self.hasColor( clrString ) ) {
				self._colors.push( clrString );
				self._update();
			}
		},

		removeColor : function( clrString ) {
			var self = this,
				colors = self._colors,
				index = colors.indexOf( clrString );
			if ( index !== -1) {
				colors.splice( index, 1 );
				self._update();
			} 
		},

		hasColor : function( clrString ) {
			return this._colors.indexOf( clrString ) !== -1;
		},

		getColors : function() {
			return this._colors;
		}

	});

	return ColorPalette;

});