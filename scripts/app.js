define(['core/pix', 'core/color'], function( Pix, Color ) {
	var app = new Pix();
	app.start();

	var c = new Color('#77ffc3d9');
	console.log( c.toRGBString() );
	console.log( c.toRGBAString() );
	console.log( c.toHSLA() );
	var hsl = c.toHSLA() ;
	c.fromHSL( hsl.h, hsl.s, hsl.l );
	console.log( c.toRGBA() );
	console.log( c.toHSLAString() );
});