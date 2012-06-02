define(function() {

	"use strict";
	
	var ColorHelper = { // From http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript

		"RGB" : 0,
		"RGBA" : 1,
		"HSL" : 2,
		"HSLA" : 3,
		"HEXA" : 4,

		getRGBString : function( r, g, b ) {
			return 'rgb('+r+','+g+','+b+')';
		},

		getHSLString : function( h, s, l ) {
			var h = 360*h,
				s = ( (s*100) | 0 )+"%",
				l = ( (l*100) | 0 )+"%";
			return 'hsl('+h+','+s+','+l+')';
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