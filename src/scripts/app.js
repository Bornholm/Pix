
// RequireJS Config
requirejs.config({
	shim : {
		'libs/marked' : {
			exports : 'marked'
		}
	}
});

define(['core/pix'], function( Pix ) {
	var app = new Pix();
	app.start();
});