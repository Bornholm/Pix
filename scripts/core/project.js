define(['libs/classy'], function( Class ) {

	"use strict";

	var Layer = Class.$extend({

		__init__ : function( width, height ) {

			this._zoom = 1;
			this._initCanvas( width, height );
		},

		_initCanvas : function( width, height ) {

			var canvas, context,
				zCanvas, zContext,
				self = this;

			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			zCanvas = document.createElement('canvas');
			zCanvas.width = width;
			zCanvas.height = height;

			self._canvas = canvas;
			self._context = canvas.getContext('2d');
			self._zCanvas = zCanvas;
			self._zContext = zCanvas.getContext('2d');

			self.clear();
		},

		setPixel : function( x, y, clear ) {
			var self = this,
				zoom = self._zoom,
				context = self.getContext(),
				zContext = self.getContext( true );
			x = Math.floor(x/zoom);
			y = Math.floor(y/zoom);
			context[clear ?  'clearRect' : 'fillRect' ]( x, y, 1, 1 );
			zContext[clear ?  'clearRect' : 'fillRect' ]( x*zoom, y*zoom, zoom, zoom );
		},

		line : function( x, y, x2, y2, clear ) { // From https://github.com/skyboy/AS3-Utilities/blob/master/skyboy/utils/efla.as
			
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
					self.setPixel(x, y, clear);
					i += inc;
					if (--id) {
						self.setPixel(x + i * multDiff, y + i, clear);
						i += inc;
						if (--id) {
							self.setPixel(x + i * multDiff, y + i, clear);
							i += inc;
						}
					}
				}
				while (i != shortLen) {
					self.setPixel(x + i * multDiff, y + i, clear);
					i += inc;
					self.setPixel(x + i * multDiff, y + i, clear);
					i += inc;
					self.setPixel(x + i * multDiff, y + i, clear);
					i += inc;
					self.setPixel(x + i * multDiff, y + i, clear);
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
					self.setPixel(x, y, clear);
					i += inc;
					if (--id) {
						self.setPixel(x + i, y + i * multDiff, clear);
						i += inc;
						if (--id) {
							self.setPixel(x + i, y + i * multDiff, clear);
							i += inc;
						}
					}
				}
				while (i != longLen) {
					self.setPixel(x + i, y + i * multDiff, clear);
					i += inc;
					self.setPixel(x + i, y + i * multDiff, clear);
					i += inc;
					self.setPixel(x + i, y + i * multDiff, clear);
					i += inc;
					self.setPixel(x + i, y + i * multDiff, clear);
					i += inc;
				}
			}

		},

		getContext : function( zoomed ) {
			return zoomed ? this._zContext : this._context;
		},

		getCanvas : function( zoomed ) {
			return zoomed ? this._zCanvas : this._canvas;
		},

		clear : function() {

			var self = this,
				canvas = self.getCanvas(),
				context = self.getContext(),
				zCanvas = self.getCanvas( true ),
				zContext = self.getContext( true );

			context.clearRect( 0, 0, canvas.width, canvas.height );
			zContext.clearRect( 0, 0, zCanvas.width, zCanvas.height );
		},

		applyZoom : function( zoom ) {

			var data, i, j, delta,
				r, g, b, a,
				self = this,
				canvas = self.getCanvas(),
				zCanvas = self.getCanvas( true ),
				width = canvas.width,
				height = canvas.height,
				context = self.getContext(),
				zContext = self.getContext( true );

			self._zoom = zoom;

			zCanvas.width = width * zoom;
			zCanvas.height = height * zoom;

			data = context.getImageData(0, 0, width, height).data;

			zContext.save();

			for( i = 0; i < width; ++i ) {
				for( j = 0; j < height; ++j ) {
					delta = j*(width << 2) + (i << 2);
					r = data[ delta ];
					g = data[ delta + 1];
					b = data[ delta + 2];
					a = data[ delta + 3];
					zContext.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
					zContext.fillRect( i*zoom, j*zoom, zoom, zoom);
				}
			}

			zContext.restore();

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

		getPreview : function() {

			var self = this,
				container = $('<div />').addClass('project-layers'),
				layers = self._layers,
				len = layers.length;

			container.empty();
			while(len--) {
				container.prepend( layers[len].getCanvas() );
			}

			return container;
		},

		_updateMainView : function() {

			var self = this,
				layers = self._layers,
				len = layers.length,
				container = self._container;

			container.empty();
			while(len--) {
				container.prepend( layers[len].getCanvas( true ) );
			}
		},

		_updateBackground : function() {
			var self = this,
				zoom = self.zoom(),
				canvas = self._background || document.createElement('canvas'),
				context = canvas.getContext('2d');

			canvas.height = canvas.width = zoom *2;

			context.fillStyle = '#fff';
			context.fillRect( 0, 0, zoom*2, zoom*2 );
			
			context.fillStyle = '#ccc';
			context.fillRect( 0, 0, zoom, zoom );
			context.fillRect( zoom, zoom, zoom, zoom );

			self._container.find('canvas').css('background-image', 'none');
			self._container.find('canvas').first().css('background-image', 'url("'+canvas.toDataURL()+'")');
			self._background = canvas;
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
				self._updateColor();
			}
		},

		_updateColor : function() {

			var self = this,
				color = self._color,
				layers = self.getLayers(),
				len = layers.length;

			while(len--) {
				layers[len].getContext().fillStyle = color;
				layers[len].getContext(true).fillStyle = color;
			}

		},

		setPixel : function( x, y ) {
			this.getActiveLayer().setPixel( x, y );
		},

		line : function( x, y, x2, y2, eraseMode ) {
			this.getActiveLayer().line( x, y, x2, y2, eraseMode );
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
				self._updateMainView();
			}
		},

		_updateZoom : function() {

			var self = this,
				zoom = self._zoom,
				layers = self.getLayers(),
				width = self.width(),
				height = self.height(),
				len = layers.length;

			while(len--) {
				layers[len].applyZoom( zoom, width, height );
			}

			self._updateBackground();
		}

	});

	return Project;
});