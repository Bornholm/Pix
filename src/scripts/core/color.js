define(function() {

	"use strict";

	var has = 'hasOwnProperty';
	
	var Color = function( color ) {

		if ( color instanceof Color ) {
			return new Color( color.toRGBA() );
		} 

		var self = this;
		self._a = 1;
		self.from( color );
	},
	p = Color.prototype;

	Color.HEXA = "HEXA";
	Color.HEXA_ALPHA = "HEXA_ALPHA";
	Color.HSL = "HSL";
	Color.HSLA = "HSLA";
	Color.RGB = "RGB";
	Color.RGBA = "RGBA";

	var hueToRGB = function( p, q, t ) {
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
	};

	Color.HSLToRGB = function( h, s, l ) {
		var r, g, b;
		if(s === 0){
			r = g = b = l; // achromatic
		} else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hueToRGB(p, q, h + 1/3);
			g = hueToRGB(p, q, h);
			b = hueToRGB(p, q, h - 1/3);
		}
		return { r : (r * 255)<<0, g : (g * 255)<<0, b : (b * 255)<<0 };
	};

	Color.RGBToHSL = function( r, g, b ) {

		r /= 255;
		g /= 255;
		b /= 255;

		var h, s, d,
			max = Math.max(r, g, b), 
			min = Math.min(r, g, b),
			l = (max + min) / 2;

		if(max === min){
			h = s = 0; // achromatic
		} else {
			d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			};
			h /= 6;
		}

		return { h : h ,  s : s, l : l };
	};


	p.patterns = {
		hexa : /^\#(([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2}))$/,
		hexaAlpha : /^\#(([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2}))$/,
		rgb : /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/,
		rgba : /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1}(\.\d*)?)\s*\)/,
		hsl : /^hsl\(\s*(\d{1,3}(\.\d*)?)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/,
		hsla : /^hsla\(\s*(\d{1,3}(\.\d*)?)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1}(\.\d*)?)\s*\)/
	};

	p._parseColorString = function( str ) {

		var color,
			alpha = "a",
			self = this;

		// Test RGB
		color = self._parseRGBString( str );
		if( color ) {
			color.type = color[has]( alpha ) ? Color.RGBA : Color.RGB;
			return color;
		}

		// Test HSL
		color = self._parseHSLString( str );
		if( color ) {
			color.type = color[has]( alpha ) ? Color.HSLA : Color.HSL;
			return color;
		}

		// Test HEXA
		color = self._parseHexaString( str );
		if( color ) {
			color.type = color[has]( alpha ) ? Color.HEXA_ALPHA : Color.HEXA;
			return color;
		}

	};

	p.toRGBString = function( alpha ) {
		var color = this.toRGBA();
		return 'rgb'+ ( alpha ? 'a' : '') +'('+color.r+','+color.g+','+color.b+ ( alpha ? ','+this._a : '' ) + ')';
	};

	p.toHSLString = function( alpha ) {
		var self = this,
			h = (360*self._h) << 0,
			s = ( (self._s*100) << 0 )+"%",
			l = ( (self._l*100) << 0 )+"%";
		return 'hsl'+ ( alpha ? 'a' : '') +'('+h+','+s+','+l+ ( alpha ? ','+self._a : '' )+')';
	};

	p.toRGBA = function() {
		var self = this,
			color = Color.HSLToRGB(
				self._h,
				self._s,
				self._l
			);
		color.a = self._a;
		return color;
	};

	p.toHSLA = function() {
		var self = this;
		return  {
			h : +(self._h),
			s : +(self._s),
			l : +(self._l),
			a : +(self._a)
		};
	};

	p.from = function( color ) {

		var self = this,
			isOk = false;

		if( color ) {

			if( typeof color === 'string' ) {
				color = self._parseColorString( color );
				if( color ) {
					color[has]('a') && ( self._a = color.a );
					switch( color.type ) {
						case Color.HEXA:
						case Color.HEXA_ALPHA:
						case Color.RGB:
						case Color.RGBA:
							color = Color.RGBToHSL( color.r, color.g, color.b );
						case Color.HSL:
						case Color.HSLA:
							self._h = +(color.h);
							self._s = +(color.s);
							self._l = +(color.l);
							isOk = true;
					};
				}
			} else if( typeof color === 'object' ) {
				if( color[has]('r') && color[has]('g') && color[has]('b') ) {
					self.fromRGB( color.r, color.g, color.b );
					color[has]('a') && self.alpha( color.a );
					isOk = true;
				} else if ( color[has]('h') && color[has]('s') && color[has]('l') ) {
					self.fromHSL( color.h, color.s, color.l );
					color[has]('a') && self.alpha( color.a );
					isOk = true;
				}
			}

		} else {
			self._h = 0;
			self._s = 0;
			self._l = 0;
			isOk = true;
		}

		if( !isOk ) throw new Error('Unknown color format !');
	};

	p.fromHSL = function( h, s, l ) {
		var self = this;
		self._h = +h;
		self._s = +s;
		self._l = +l;
	};

	p.fromRGB = function( r, g, b ) {
		var self = this,
			hsl = Color.RGBToHSL( r, g, b );
		self._h = +hsl.h;
		self._s = +hsl.s;
		self._l = +hsl.l;
	};

	p.alpha = function( a ) {
		if( arguments.length > 0 ) {
			this._a = a > 1 ? 1 : ( a < 0 ? 0 : a );
		} else {
			return this._a;
		}
	};

	p.equals = function( color, threshold ) {
		color = new Color( color );
		threshold = threshold !== undefined ? threshold : 0;
		return Math.abs( color._h - this._h ) <= threshold &&
				Math.abs( color._s - this._s ) <= threshold &&
				Math.abs( color._l - this._l ) <= threshold &&
				Math.abs( color._a - this._a ) <= threshold;
	};

	p.toString = function() {
		return this.toHSLString( true );
	};	

	p._parseHexaString = function( str ) {
		var match, color,
			self = this,
			hexaPattern = self.patterns.hexa,
			hexaAlphaPattern = self.patterns.hexaAlpha;

		match = str.match( hexaPattern );
		if( match ) {
			color = {
				r : parseInt( match[2], 16),
				g : parseInt( match[3], 16),
				b : parseInt( match[4], 16)
			};
		} else {
			match = str.match( hexaAlphaPattern );
			if( match ) {
				color = {
					r : parseInt( match[3], 16),
					g : parseInt( match[4], 16),
					b : parseInt( match[5], 16),
					a : parseInt( match[2], 16)
				};
			}
		}

		return color ? color : null;
	};

	p._parseRGBString = function( str ) {

		var match, color,
			self = this,
			rgbPattern = self.patterns.rgb,
			rgbaPattern = self.patterns.rgba;

		match = str.match( rgbPattern );
		if( match ) {
			color = {
				r : +match[1],
				g : +match[2],
				b : +match[3]
			};
		} else {
			match = str.match( rgbaPattern );
			if( match ) {
				color = {
					r : +match[1],
					g : +match[2],
					b : +match[3],
					a : +match[4]
				};
			}
		}

		return color ? color : null;
	};

	p._parseHSLString = function( str ) {

		var match, color,
			self = this,
			hslPattern = self.patterns.hsl,
			hslaPattern = self.patterns.hsla;

		match = str.match( hslPattern );
		if( match ) {
			color = {
				h : +match[1]/360,
				s : +match[3]/100,
				l : +match[4]/100
			};
		} else {
			match = str.match( hslaPattern );
			if( match ) {
				color = {
					h : +match[1]/360,
					s : +match[3]/100,
					l : +match[4]/100,
					a : +match[5]
				};
			}
		}

		return color ? color : null;

	};

	return Color;
});