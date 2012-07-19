define(['libs/classy', 'ui/widget', 'core/asynctask', 'core/color', 'core/actionmanager', 'core/action', 'core/helpers/geom'],
 function( Class, Widget, AsyncTask, Color, ActionManager, Action, Geom ) {

	"use strict";

	// Layers Async Methods

	var asyncZoom = function( imageData, zImageData, zoom ) {

		var i, j, delta,
			zWidth = zImageData.width,
			zHeight = zImageData.height,
			width = imageData.width,
			zArr = zImageData.data,
			arr = imageData.data;
			
		for( i = 0; i < zWidth; ++i ) {
			for( j = 0; j < zHeight; ++j ) {
				zDelta = j*(zWidth << 2) + (i << 2);
				delta = (j/zoom|0)*(width << 2) + ( (i/zoom|0) << 2);
				zArr[ zDelta ] = arr[ delta ];
				zArr[ zDelta + 1 ] = arr[ delta + 1];
				zArr[ zDelta + 2 ] = arr[ delta + 2];
				zArr[ zDelta + 3 ] = arr[ delta + 3];
			}
		};

		return zImageData;
	};

	var Layer = Class.$extend({

		_asyncZoomTask : new AsyncTask( asyncZoom ),

		__init__ : function( width, height ) {

			var self = this;

			self._zoom = 1;
			this._initCanvas( width, height );
			self._onZoomCompleteBinded = self._onZoomComplete.bind( self );
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

		setPixel : function( x, y, color ) {

			var pixels, data, i, len,
				self = this,
				zoom = self._zoom,
				context = self.getContext(),
				zContext = self.getContext( true );

			color = color.toRGBA();

			pixels = context.getImageData( x, y, 1, 1 );
			data = pixels.data;

			// 0<->1 => 0<->255
			color.a = (color.a*255) >> 0; // n >> 0 === Math.round( n )

			for( i = 0, len = data.length; i < len; i += 4 ) {
				data[i] = color.r;
				data[i+1] = color.g;
				data[i+2] = color.b;
				data[i+3] = color.a;
			};

			context.putImageData( pixels, x, y );

			pixels = zContext.getImageData( x*zoom, y*zoom, zoom, zoom );
			data = pixels.data;

			for( i = 0, len = data.length; i < len; i += 4 ) {
				data[i] = color.r;
				data[i+1] = color.g;
				data[i+2] = color.b;
				data[i+3] = color.a;
			};

			zContext.putImageData( pixels, x*zoom, y*zoom );

		},

		getPixel : function( x, y ) {

			var pixels, data, i, len,
				color = {},
				self = this,
				zoom = self._zoom,
				context = self.getContext();

			pixels = context.getImageData( x, y, 1, 1 );
			data = pixels.data;

			color.r = data[0];
			color.g = data[1];
			color.b = data[2];
			color.a = data[3];

			return new Color( color );

		},

		getPixels : function( points ) {
			var i, len, 
				pixels = [],
				self = this;
			for( i = 0, len = points.length; i < len; i += 2 ) {
				pixels.push( self.getPixel( points[i], points[i+1] ) );
			}
			return pixels;
		},

		/* colors : [Color...] | Color */
		setPixels : function( points, color ) {

			var i, len,
				self = this,
				isOneColor = color instanceof Color ? true : false,
				zoom = self._zoom;

			for( i = 0, len = points.length; i < len; i += 2 ) {
				self.setPixel( points[i], points[i+1], isOneColor ? color : color[i >> 1] );
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

			var data, zData, i, j, delta,
				r, g, b, a,
				self = this,
				asyncZoom = self._asyncZoomTask,
				canvas = self.getCanvas(),
				zCanvas = self.getCanvas( true ),
				width = canvas.width,
				height = canvas.height,
				context = self.getContext(),
				zContext = self.getContext( true );

			self._zoom = zoom;
			zCanvas.width = width * zoom;
			zCanvas.height = height * zoom;

			data = context.getImageData(0, 0, width, height);
			zData = zContext.getImageData(0, 0, width * zoom, height * zoom );

			asyncZoom.run( [ data, zData, zoom ], self._onZoomCompleteBinded );

		},

		_onZoomComplete : function( zImageData ) {
			var self = this,
				zContext = self.getContext( true );
			zContext.putImageData( zImageData, 0, 0, 0, 0, zImageData.width, zImageData.height );
			zContext.fillStyle = self.getContext().fillStyle;
		}

	});
	
	var PixelCanvas = Widget.$extend({

		widgetClass : 'pixel-canvas',

		__init__ : function( opts ) {
			
			var self = this;

			self.$super();

			self._actionManager = new ActionManager();

			opts = opts || {};

			self._width =  opts.width || 640;
			self._height =  opts.height || 480;

			self._layers = [];
			self._activeLayerIndex = 0;

			self._initContainer();
			self.newLayer();

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

		undo : function() {
			this._actionManager.undo();
		},

		redo : function() {
			this._actionManager.redo();
		},

		_initContainer : function() {
			var self = this,
				el = self.$el,
				layersContainer = $('<div />').addClass('layers');
			self._layersContainer = layersContainer;
			el.append( layersContainer );
			this._updateMainView();
		},

		_updateMainView : function() {

			var self = this,
				layers = self._layers,
				len = layers.length,
				container = self._layersContainer;

			container.empty();
			while(len--) {
				container.prepend( layers[len].getCanvas( true ) );
			}
		},

		getPreview : function() {

			var layersContainer,
				self = this,
				widget = self.$el.clone(),
				layers = self._layers,
				len = layers.length;

			layersContainer = widget.find('.layers');

			layersContainer.empty();
			while(len--) {
				layersContainer.prepend( layers[len].getCanvas() );
			}

			return widget;
		},

		_updateBackground : function() {
			var self = this,
				zoom = self.zoom(),
				layersContainer = self._layersContainer,
				canvas = self._background || document.createElement('canvas'),
				context = canvas.getContext('2d');

			canvas.height = canvas.width = zoom *2;

			context.fillStyle = '#fff';
			context.fillRect( 0, 0, zoom*2, zoom*2 );
			
			context.fillStyle = '#ccc';
			context.fillRect( 0, 0, zoom, zoom );
			context.fillRect( zoom, zoom, zoom, zoom );

			layersContainer.find('canvas').css('background-image', 'none');
			layersContainer.find('canvas').first().css('background-image', 'url("'+canvas.toDataURL()+'")');
			self._background = canvas;
		},

		setPixel : function( x, y, color ) {

			var action,
				self = this,
				zoom = self.zoom(),
				activeLayer = this.getActiveLayer(),
				prevColor = activeLayer.getPixel( x, y );

			action = new Action(
				{ method : "setPixel", context : self, args : [x, y, color]  },
				{ method : "setPixel", context : self, args : [x, y, prevColor]  }
			);

			activeLayer.setPixel( x/zoom | 0 , y/zoom | 0, color );

			this._actionManager.register( action );

			this._dispatchChange( 'pixel', x, y, color );
		},

		line : function( x0, y0, x1, y1, color ) {

			var action,
				i, len, points,
				self = this,
				layer = self.getActiveLayer(),
				zoom = self.zoom();

			points = Geom.getLinePoints( x0/zoom | 0, y0/zoom | 0, x1/zoom | 0, y1/zoom | 0 );

			action = new Action(
				{ method : "setPixels", context : layer, args : [points, color]  },
				{ method : "setPixels", context : layer, args : [points, layer.getPixels( points)]  }
			);

			layer.setPixels( points, color );

			this._actionManager.register( action, true );

			self._dispatchChange( 'line', x0, y0, x1, y1, color );
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
		},

		_dispatchChange : function() {
			var args = Array.prototype.slice.call( arguments );
			this.$el.trigger('pixelcanvas:change', args );
		}

	});

	return PixelCanvas;
});