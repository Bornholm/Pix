define( ["yajf/module", "ui/menu"], function( Module, Menu ) {
	
	var MenuModule = Module.$extend({

		start : function( opts ) {

			opts = opts || {};

			var self = this;

			self.menu = new Menu({
				container : opts.container,
				items : opts.items,
				itemClick : self._onItemClick.bind( self )
			});
		
		},

		_onItemClick : function( item ) {
			var events = this.sandbox.events;
			events.publish( "menu:item:click", [item] );
		}
		
	});


	return MenuModule;


});