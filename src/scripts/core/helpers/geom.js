define({
	
	// From http://free.pages.at/easyfilter/bresenham.html
	// return [x0, y0, x1, y1, ... xn, yn];
	getLinePoints : function( x0, y0, x1, y1 ) {

		var e2,
			points = [],
			dx = Math.abs( x1 - x0 ), sx = x0<x1 ? 1 : -1,
			dy = -Math.abs( y1 - y0 ), sy = y0<y1 ? 1 : -1,
			err = dx + dy;

		while( true ) {
			points.push( x0, y0 );
			if( x0=== x1 && y0 === y1 ) break;
			e2 = err << 1;
			if (e2 >= dy) { err += dy; x0 += sx; }
			if (e2 <= dx) { err += dx; y0 += sy; }
		}

		return points;

	},

	getEllipsePoints : function( x0, y0, x1, y1 ) {
		
	}


});