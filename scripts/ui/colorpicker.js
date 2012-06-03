define(['ui/widget', 'core/helpers/colorhelper'], function( Widget, ColorHelper, undef ) {

	"use strict";

	var ColorPicker = Widget.$extend({

		widgetClass : "colorpicker",

		events : {
			'mouseout' : "_stopMovingCursors",
			'mouseup .color-map' : "_stopMovingColorMapCursor",
			'mousedown .color-map' : "_startMovingColorMapCursor",
			'mousemove .color-map' : "_colorMapMouseMoveHandler",
			'mouseup .hue-map' : "_stopMovingHueMapCursor",
			'mousedown .hue-map' : "_startMovingHueMapCursor",
			'mousemove .hue-map' : "_hueMapMouseMoveHandler"
		},

		__init__ : function( opts ) {

			var el,
				self = this;

			self.$super();

			// Options 
			opts = opts || {};
			self._colorMapHeight = opts.colorMapHeight || 150;
			self._colorMapWidth = opts.colorMapWidth || 150;
			self._hueMapHeight = opts.hueMapHeight || 150;
			self._hueMapWidth = opts.hueMapWidth || 20;

			// Init
			self._colorMapMouseDown = false;
			self._hueMapMouseDown = false;
			self._color = {
				h : 0,
				s : 0.5,
				l : 0.5
			};

			self._initView();
			self._update();
		},

		_initView : function() {

			var self = this,
				el = self.$el,
				hueMap = document.createElement('canvas'),
				colorMap = document.createElement('canvas');
			
			self._colorMap = colorMap;
			self._hueMap = hueMap;

			$(colorMap).addClass('color-map');
			$(hueMap).addClass('hue-map');

			// Create color map
			colorMap.height = self._colorMapHeight;
			colorMap.width = self._colorMapWidth;
			hueMap.height = self._hueMapHeight;
			hueMap.width = self._hueMapWidth;

			el.append( colorMap ).append( hueMap );

		},

		_colorMapMouseMoveHandler : function( evt ) {

			var localCoords, sl,
				self = this,
				color = self._color,
				cursorPos = self._colorMapCursorPos,
				colorMap = self._colorMap;

			if( self._colorMapMouseDown ) {

				localCoords = self.globalToLocal( evt.clientX, evt.clientY, colorMap );
				sl = self._colorMapCursorPosToSL( localCoords.x, localCoords.y );
				color.s = sl.s;
				color.l = sl.l;

				self._updateColorMapCursor();
				self._dispatchColorChange();
			}

			return false;

		},

		_hueMapMouseMoveHandler : function( evt ) {

			var localCoords,
				self = this,
				color = self._color,
				hueMap = self._hueMap;

			if( self._hueMapMouseDown ) {

				localCoords = self.globalToLocal( evt.clientX, evt.clientY, hueMap );
				color.h = localCoords.y/hueMap.height
				self._updateHueMapCursor();
				self._colorMapDirtyRect = null;

				self._updateColorMap();
				self._updateColorMapCursor();
				self._dispatchColorChange();
			}

			return false;
		},	

		_colorMapCursorPosToSL : function( x, y ) {
			var sl = {},
				colorMap = this._colorMap;
			sl.s = x/colorMap.width;
			sl.l = 1-(y/colorMap.height);
			return sl;
		},

		_SLToColorMapCursorPos : function( s, l ) {
			var pos = {},
				colorMap = this._colorMap;
			pos.x = s*colorMap.width;
			pos.y = colorMap.height - l*colorMap.height;
			return pos;
		},

		_startMovingColorMapCursor : function( evt ) {
			this._colorMapMouseDown = true;
			this._colorMapMouseMoveHandler( evt );
			return false;
		},

		_startMovingHueMapCursor : function( evt ) {
			this._hueMapMouseDown = true;
			this._hueMapMouseMoveHandler( evt );
			return false;
		},

		_stopMovingCursors : function() {
			this._stopMovingColorMapCursor();
			this._stopMovingHueMapCursor();
		},

		_stopMovingColorMapCursor : function() {
			this._colorMapMouseDown = false;
		},

		_stopMovingHueMapCursor : function() {
			this._hueMapMouseDown = false;
		},

		toHSLString : function() {
			var color = this.toHSL();
			return ColorHelper.getHSLString( color.h, color.s, color.l );
		},

		toRGBString : function() {
			var color = this.toRGB();
			return ColorHelper.getRGBString( color.r, color.g, color.b );
		},

		toHSL : function() {
			return this._color;
		},

		toRGB : function() {
			var c = this.toHSL();
			return ColorHelper.HSLToRGB( c.h, c.s, c.l );
		},

		fromColorString : function( str ) {
			var self = this,
				color =  ColorHelper.fromColorString( str );

			if ( color && ( color.type === ColorHelper.HSL || color.type === ColorHelper.HSLA ) ) {
				self._color = color;
			} else if( color && ( color.type === ColorHelper.RGB || color.type === ColorHelper.RGBA ||
						color.type === ColorHelper.HEXA || color.type === ColorHelper.HEXA_ALPHA ) ) {
				self._color = ColorHelper.RGBToHSL( color.r, color.g, color.b );
			} else {
				throw new Error('Colorpicker - Unknown color format : '+str);
			}
			
			self._dispatchColorChange();
			self._update();
		},

		fromRGB : function( r, g, b ) {
			var self = this,
				hsl =  ColorHelper.RGBToHSL( r, g, b );
			self._color = hsl;
			self._dispatchColorChange();
			self._update();
		},

		fromHSL : function( h, s, l ) {
			var self = this,
				color = self._color;
			color.h = h;
			color.s = s;
			color.l = l;
			self._dispatchColorChange();
			self._update();
		},

		_update : function() {
			var self = this;
			self._colorMapDirtyRect = null;
			self._updateColorMap();
			self._updateHueMap();
			self._updateHueMapCursor();
			self._updateColorMapCursor();
		},

		_updateHueMap : function() {

			var i, l, 
				x, y, c,
				width, height, ctx,
				imageData, pixels,
				self = this,
				hueMap = self._hueMap;

			ctx = hueMap.getContext('2d');
			width = hueMap.width;
			height = hueMap.height;
			imageData = ctx.createImageData( width, height );
			pixels = imageData.data;
			l = pixels.length;

			for( i = 0; i < l; i += 4 ) {
				x = (i/4)%width;
				y = ((i/4)/width) | 0;
				c = ColorHelper.HSLToRGB( y/height, 1, 0.5 );
				pixels[i] = c.r;
				pixels[i+1] = c.g;
				pixels[i+2] = c.b;
				pixels[i+3] = 255;
			}

			ctx.putImageData( imageData, 0, 0 );

		},

		_updateColorMap : function() {

			var i, l, 
				x, y, c,
				width, height, ctx,
				imageData, pixels,
				self = this,
				hue = self._color.h,
				colorMap = self._colorMap;

			ctx = colorMap.getContext('2d');
			width = colorMap.width;
			height = colorMap.height;
			imageData = ctx.createImageData( width, height );
			pixels = imageData.data;
			l = pixels.length;

			for( i = 0; i < l; i += 4 ) {
				x = (i/4)%width;
				y = ((i/4)/width) | 0;
				c = ColorHelper.HSLToRGB( hue, x/width, 1 - (y/height) );
				pixels[i] = c.r;
				pixels[i+1] = c.g;
				pixels[i+2] = c.b;
				pixels[i+3] = 255;
			}

			ctx.putImageData( imageData, 0, 0 );
		},

		_updateHueMapCursor : function() {

			var dirtyRect, 
				width, height,
				self = this,
				cursorHeight = 4,
				margin = 2,
				canvas = self._hueMap,
				ctx = canvas.getContext('2d'),
				hue = self._color.h;

			height = canvas.height;
			width = canvas.width;

			dirtyRect = self._hueMapDirtyRect = self._hueMapDirtyRect || {};

			// Restore dirtyRect
			if( dirtyRect.data ) {
				ctx.putImageData( dirtyRect.data, 0, dirtyRect.y );
			}

			// Save rect
			dirtyRect.y = (hue*height)-cursorHeight/2-margin;
			dirtyRect.data = ctx.getImageData( 0, dirtyRect.y, width , cursorHeight+(margin << 1) );

			ctx.strokeRect( 0, hue*height-cursorHeight/2, width, cursorHeight );
		},

		_updateColorMapCursor : function() {

			var dirtyRect,
				self = this,
				margin = 2,
				radius = 5,
				diam = radius << 1,
				canvas = self._colorMap,
				ctx = canvas.getContext('2d'),
				color = self._color,
				pos = self._SLToColorMapCursorPos( color.s, color.l );

			dirtyRect = self._colorMapDirtyRect = self._colorMapDirtyRect || {};

			// Restore dirtyRect
			if( dirtyRect.data ) {
				ctx.putImageData( dirtyRect.data, dirtyRect.x, dirtyRect.y );
			}

			// Save rect
			dirtyRect.x = pos.x-radius-margin;
			dirtyRect.y = pos.y-radius-margin;
			dirtyRect.data = ctx.getImageData( dirtyRect.x, dirtyRect.y, diam + (margin << 1) , diam + (margin << 1) );

			ctx.beginPath();
			ctx.strokeStyle = "white";
			ctx.arc( pos.x, pos.y, radius, 0, 2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = "black";
			ctx.arc( pos.x, pos.y, radius-2, 0, 2*Math.PI);
			ctx.closePath();
			ctx.stroke();

		},

		_dispatchColorChange : function() {
			var self = this;
			self.$el.trigger( self.widgetClass+":change", [ self.toHSLString(), self.toRGBString() ] );
		}


	});

	return ColorPicker;

});