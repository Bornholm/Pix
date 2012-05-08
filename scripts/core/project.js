define(['libs/classy'], function( Class ) {

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
			self._color = '#FF000000';

			self._initContainer();
			self.newLayer();
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

		pixel : function( x, y ) {
			var self = this,
				context = self.getActiveLayer().getContext();
			if( arguments.length === 0 ) {
				
			} else {
				context.fillStyle = self._color;
				context.fillRect( x, y, 1, 1 );
			}
		}

	});

	return Project;
});