define(['ui/widget', 'core/color'], function( Widget, Color ){

	var ColorPalette = Widget.$extend({

		widgetClass : 'colorpalette',

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
				curr.innerHTML = '<span class="alpha">'+colors[i].alpha().toFixed(1)+'</span>';
				elements.push( curr );
			}

			elements.length > 0 && el.html( elements );
		},

		_onColorClick : function( evt ) {
			var target = $(evt.currentTarget),
				color = target.css('background-color');
			this.$el.trigger( this.widgetClass+':select', [ new Color( color ) ] );
		},

		addColor : function( color ) {
			var self = this;
			color = new Color( color );
			if( !self.hasColor( color ) ) {
				self._colors.push( color );
				self._update();
			}
		},

		removeColor : function( color ) {
			var self = this,
				colors = self._colors,
				index = self.indexOf( clrString );
			if ( index !== -1) {
				colors.splice( index, 1 );
				self._update();
			} 
		},

		hasColor : function( color ) {
			return this.indexOf( color ) !== -1;
		},

		indexOf : function( color ) {
			var i, c,
				colors = this._colors,
				len = colors.length;
			color = new Color( color );
			for ( i = 0; i < len; ++i ) {
				c = colors[i];
				if( c.nearlyEquals( color ) ) {
					return i;
				}
			}
			return -1;
		},

		getColors : function() {
			return this._colors;
		}

	});

	return ColorPalette;

});