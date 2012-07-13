define(['modules/tools/pencil'], function( Pencil ) {
	
	var Eraser = Pencil.$extend({

		_toolDefinition : {
			id : 'erase',
			label : 'Eraser', 
			icon : 'images/eraser.png'
		},

		start : function( opts ) {
			var self = this;
			self.$super( opts );
			self._eraseMode = true;
		}

	});

	return Eraser;

});