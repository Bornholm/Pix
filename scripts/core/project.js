define(['libs/classy'], function( Class ) {

	"use strict";

	var Layer = Class.$extend({

		__init__ : function( width, height ) {
			this._initCanvas( width, height );
		},

		_initCanvas : function( width, height ) {
			var canvas, context,
				self = this;

			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			self._canvas = canvas;
			self._context = canvas.getContext('2d');
		},

		getElement : function() {
			return this._canvas;
		},

		getContext : function() {
			return this._context;
		},

		getCanvas : function() {
			return this._canvas;
		},

		applyZoom : function() {

		}

	});
	
	var Project = Class.$extend({

		__init__ : function( opts ) {
			
			var self = this;

			opts = opts || {};

			self._width =  opts.width || 640;
			self._height =  opts.height || 480;

			self._layers = [];
			self._activeLayerIndex = 0;

			self._initContainer();
			self.newLayer();

			self.color('#FF000000');
			self.zoom(1);
		},

		newLayer : function() {
			var self = this,
				layers = self._layers;
			layers.push( new Layer( self._width, self._height ) );
			self.setActiveLayerByIndex( layers.length -1 );
			self._updateMainView();
		},

		getActiveLayerIndex : function() {
			return this._activeLayerIndex;
		},

		getActiveLayer : function() {
			return this._layers[ this._activeLayerIndex ];
		},

		setActiveLayerByIndex : function( index ) {
			this._activeLayerIndex = index;
		},

		getLayers : function() {
			return this._layers;
		},

		_initContainer : function() {
			this._container = $('<div />').addClass('project-layers');
			this._updateMainView();
		},

		getMainView : function() {
			return this._container;
		},

		_updateMainView : function() {

			var self = this,
				layers = self._layers,
				len = layers.length,
				container = self._container;

			container.empty();
			while(len--) {
				container.prepend( layers[len].getElement() );
			}
		},

		globalToLocal : function( globalX, globalY ) {

			var self = this,
				offset = self._container.offset(),
				coords = {};

			coords.x = globalX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			coords.y = globalY + document.body.scrollTop + document.documentElement.scrollTop; 
			coords.x -= offset.left;
			coords.y -= offset.top;

			return coords;
		},

		// Drawing methods

		color : function( color ) {
			var self = this;
			if( arguments.length === 0 ) {
				return self._color;
			} else {
				self._color = color;
			}
		},

		_updateColor : function() {

			var self = this,
				color = self._color,
				layers = self.getLayers(),
				len = layers.length;

			while(len--) {
				layers[len].getContext().fillStyle = color;
			}

		},

		setPixel : function( x, y ) {
			var self = this,
				zoom = self.zoom(),
				context = self.getActiveLayer().getContext();
			context.fillRect( x, y, zoom, zoom );
		},

		line : function( x, y, x2, y2 ) { // From https://github.com/skyboy/AS3-Utilities/blob/master/skyboy/utils/efla.as
			
			var id, inc, multDiff,
				i = 0,
				self = this,
				shortLen = y2 - y,
				longLen = x2 - x;

			if (!longLen) if(!shortLen) return;

			// TODO: check for this above, swap x/y/len and optimize loops to ++ and -- (operators twice as fast, still only 2 loops)
			if ( (shortLen ^ (shortLen >> 31)) - (shortLen >> 31) > (longLen ^ (longLen >> 31)) - (longLen >> 31)) {
				if (shortLen < 0) {
					inc = -1;
					id = -shortLen % 4;
				} else {
					inc = 1;
					id = shortLen % 4;
				}
				multDiff = !shortLen ? longLen : longLen / shortLen;

				if (id) {
					self.setPixel(x, y);
					i += inc;
					if (--id) {
						self.setPixel(x + i * multDiff, y + i);
						i += inc;
						if (--id) {
							self.setPixel(x + i * multDiff, y + i);
							i += inc;
						}
					}
				}
				while (i != shortLen) {
					self.setPixel(x + i * multDiff, y + i);
					i += inc;
					self.setPixel(x + i * multDiff, y + i);
					i += inc;
					self.setPixel(x + i * multDiff, y + i);
					i += inc;
					self.setPixel(x + i * multDiff, y + i);
					i += inc;
				}
			} else {
				if (longLen < 0) {
					inc = -1;
					id = -longLen % 4;
				} else {
					inc = 1;
					id = longLen % 4;
				}
				multDiff = !longLen ? shortLen : shortLen / longLen;

				if (id) {
					self.setPixel(x, y);
					i += inc;
					if (--id) {
						self.setPixel(x + i, y + i * multDiff);
						i += inc;
						if (--id) {
							self.setPixel(x + i, y + i * multDiff);
							i += inc;
						}
					}
				}
				while (i != longLen) {
					self.setPixel(x + i, y + i * multDiff);
					i += inc;
					self.setPixel(x + i, y + i * multDiff);
					i += inc;
					self.setPixel(x + i, y + i * multDiff);
					i += inc;
					self.setPixel(x + i, y + i * multDiff);
					i += inc;
				}
			}

		},

		width : function( w ) {
			var self = this;
			if( arguments.length === 0 ) {
				return self._width;
			} else {
				 self._width = w;
				 self._updateWidth();
			}
		},

		_updateWidth : function() {
				
			var self = this,
				width = self._width,
				layers = self.getLayers(),
				len = layers.length;

			while(len--) {
				layers[len].getCanvas().width = width;
			}
		},

		height : function( h ) {
			var self = this;
			if( arguments.length === 0 ) {
				return self._height;
			} else {
				 self._height = h;
				 self._updatHeight();
			}
		},

		_updateHeight : function() {

			var self = this,
				height = self._height,
				layers = self.getLayers(),
				len = layers.length;

			while(len--) {
				layers[len].getCanvas().height = height;
			}

		},

		zoom : function( z ) {
			var self = this;
			if( arguments.length === 0 ) {
				return self._zoom;
			} else {
				self._zoom = z;
				self._updateZoom();
			}
		},

		_updateZoom : function() {

			var self = this,
				zoom = self._zoom,
				layers = self.getLayers(),
				len = layers.length;

			while(len--) {
				layers[len].applyZoom( zoom );
			}
		}

	});

	return Project;
});