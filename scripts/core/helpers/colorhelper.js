define(function() {

	"use strict";
	
	var ColorHelper = { // From http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript

		HEXA : "HEXA",
		HEXA_ALPHA : "HEXA_ALPHA",
		HSL : "HSL",
		HSLA : "HSLA",
		RGB : "RGB",
		RGBA : "RGBA",

		_hexaPattern : /^\#(([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2}))$/,
		_hexaAlphaPattern : /^\#(([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2}))$/,

		_rgbPattern : /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/,
		_rgbaPattern : /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1}(\.\d*)?)\s*\)/,
		_hslPattern : /^hsl\(\s*(\d{1,3}(\.\d*)?)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/,
		_hslaPattern : /^hsla\(\s*(\d{1,3}(\.\d*)?)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1}(\.\d*)?)\s*\)/,

		fromColorString : function( str ) {

			var color,
				alpha = "a",
				self = this;

			// Test RGB
			color = self.fromRGBString( str );
			if( color ) {
				color.type = color.hasOwnProperty( alpha ) ? self.RGBA : self.RGB;
				return color;
			}

			// Test HSL
			color = self.fromHSLString( str );
			if( color ) {
				color.type = color.hasOwnProperty( alpha ) ? self.HSLA : self.HSL;
				return color;
			}

			// Test HEXA
			color = self.fromHexaString( str );
			if( color ) {
				color.type = color.hasOwnProperty( alpha ) ? self.HEXA_ALPHA : self.HEXA;
				return color;
			}

		},


		fromHexaString : function( str ) {
			var match, color,
				self = this,
				hexaPattern = self._hexaPattern,
				hexaAlphaPattern = self._hexaAlphaPattern;

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
		},

		fromRGBString : function( str ) {

			var match, color,
				self = this,
				rgbPattern = self._rgbPattern,
				rgbaPattern = self._rgbaPattern;

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
		},

		fromHSLString : function( str ) {

			var match, color,
				self = this,
				hslPattern = self._hslPattern,
				hslaPattern = self._hslaPattern;

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

		},

		getRGBAString : function( r, g, b, a ) {
			return 'rgba('+(r|0)+','+(g|0)+','+(b|0)+','+a+')';
		},

		getHSLAString : function( h, s, l, a ) {
			var h = 360*h,
				s = ( (s*100) | 0 )+"%",
				l = ( (l*100) | 0 )+"%";
			return 'hsla('+h+','+s+','+l+','+a+')';
		},

		HSLToRGB : function( h, s, l ) {

			var r, g, b;

		    if(s === 0){
		        r = g = b = l; // achromatic
		    }else{
		        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		        var p = 2 * l - q;
		        r = this._hueToRGB(p, q, h + 1/3);
		        g = this._hueToRGB(p, q, h);
		        b = this._hueToRGB(p, q, h - 1/3);
		    }

		    return { r : r * 255, g : g * 255, b : b * 255 };
		},

		_hueToRGB : function ( p, q, t ){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },

        RGBToHSL : function( r, g, b ) {

        	 r /= 255, g /= 255, b /= 255;

		    var max = Math.max(r, g, b), 
		    	min = Math.min(r, g, b),
		   		h, s, 
		   		l = (max + min) / 2;

		    if(max === min){
		        h = s = 0; // achromatic
		    }else{
		        var d = max - min;
		        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		        switch(max){
		            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		            case g: h = (b - r) / d + 2; break;
		            case b: h = (r - g) / d + 4; break;
		        }
		        h /= 6;
		    }

		    return { h : h ,  s : s, l : l };
        }

	};

	return ColorHelper;


});