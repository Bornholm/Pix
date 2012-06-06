define(function() {

	"use strict";
	
	var Color = function( colorString ) {

		var color,
			self = this;

		self._a = 1;

		if( colorString ) {
			color = self.parseColorString( colorString );
			if( color ) {
				color.hasOwnProperty('a') && ( self._a = color.a );
				switch( color.type ) {
					case Color.HSL:
					case Color.HSLA:
						color = Color.HSLtoRGB( color.h, color.s, color.l );
					case Color.HEXA:
					case Color.HEXA_ALPHA:
					case Color.RGB:
					case Color.RGBA:
						self._r = color.r;
						self._g = color.g;
						self._b = color.b;
				};
			} else {
				throw new Error('Unknown color format !');
			}
		} else {
			self._r = 0;
			self._g = 0;
			self._b = 0;
		}

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
		return { r : (r * 255)|0, g : (g * 255)|0, b : (b * 255)|0 };
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

	p.parseColorString = function( str ) {

		var color,
			alpha = "a",
			self = this;

		// Test RGB
		color = self.parseRGBString( str );
		if( color ) {
			color.type = color.hasOwnProperty( alpha ) ? Color.RGBA : Color.RGB;
			return color;
		}

		// Test HSL
		color = self.parseHSLString( str );
		if( color ) {
			color.type = color.hasOwnProperty( alpha ) ? Color.HSLA : Color.HSL;
			return color;
		}

		// Test HEXA
		color = self.parseHexaString( str );
		if( color ) {
			color.type = color.hasOwnProperty( alpha ) ? Color.HEXA_ALPHA : Color.HEXA;
			return color;
		}

	};

	p.toRGBAString = function() {
		var self = this;
		return 'rgba('+self._r+','+self._g+','+self._b+','+self._a+')';
	};

	p.toRGBString = function() {
		var self = this;
		return 'rgb('+self._r+','+self._g+','+self._b+')';
	};

	p.toHSLAString = function() {
		var hsl = this.toHSLA();
		hsl.h = (360*hsl.h)|0;
		hsl.s = ( (hsl.s*100) | 0 )+"%";
		hsl.l = ( (hsl.l*100) | 0 )+"%";
		return 'hsla('+hsl.h+','+hsl.s+','+hsl.l+','+hsl.a+')';
	};

	p.toHSLString = function() {
		var hsl = this.toHSLA();
		hsl.h = (360*hsl.h)|0;
		hsl.s = ( (hsl.s*100) | 0 )+"%";
		hsl.l = ( (hsl.l*100) | 0 )+"%";
		return 'hsl('+hsl.h+','+hsl.s+','+hsl.l+')';
	};

	p.toHSLA = function() {
		var self = this,
			color = Color.RGBToHSL(
				self._r,
				self._g,
				self._b
			);
		color.a = self._a;
		return color;
	};

	p.toRGBA = function() {
		var self = this;
		return  {
			r : self._r,
			g : self._g,
			b : self._b,
			a : self._a
		};
	};

	p.fromHSL = function( h, s, l ) {
		var color = Color.HSLToRGB( h, s, l );
		self._r = color.r;
		self._g = color.g;
		self._b = color.b;
	};

	p.fromRGB = function( r, g, b ) {
		self._r = r;
		self._g = g;
		self._b = b;
	};

	p.parseHexaString = function( str ) {
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

	p.parseRGBString = function( str ) {

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

	p.parseHSLString = function( str ) {

		var match, color,
			self = this,
			hslPattern = self.patterns.hsl,
			hslaPattern = self.patterns.hsla;

		match = str.match( hslPattern );
		if( match ) {
			color = {
				h : +match[1],
				s : +match[3]/100,
				l : +match[4]/100
			};
		} else {
			match = str.match( hslaPattern );
			if( match ) {
				color = {
					h : +match[1],
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