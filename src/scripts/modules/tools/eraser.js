define(['modules/tools/pencil', 'core/color'], function( Pencil, Color ) {
	
	var Eraser = Pencil.$extend({

		_toolDefinition : {
			id : 'erase',
			label : 'Eraser', 
			icon : 'images/eraser.png'
		},

		start : function( opts ) {
			var self = this;
			self.$super( opts );
			self._color = new Color('rgba(0,0,0,0)');
		},

		_dispatchColorUse : function() {
			//noop
		},

		_onColorSelected : function() {
			//noop
		}

	});

	return Eraser;

});