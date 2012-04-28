define( ["yajf/module", "ui/menu"], function( Module, Menu ) {
	
	var MenuModule = Module.$extend({

		__init__ : function( sandbox ) {
			this.sandbox = sandbox;
		},

		start : function( opts ) {

			opts = opts || {};

			var self = this,
				_ = self.sandbox._;

			self.menu = new Menu({
				container : opts.container,
				items : opts.items,
				itemClick : _.bind( self.onItemClick, self)
			});
		
		},

		onItemClick : function( item ) {
			console.log( item );
		}		

	});


	return MenuModule;


});