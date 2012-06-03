define(['ui/widget'], function( Widget ){

	var ColorPalette = Widget.$extend({

		widgetClass : 'palette',

		__init__ : function() {
			var self = this;
			self.$super();
		}

	});

	return ColorPalette;

});