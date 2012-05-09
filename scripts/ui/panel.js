define( [ "libs/classy", "libs/zepto.min" ], function( Class ) {

	var Panel = Class.$extend({

		__init__ : function( opts ) {
			var self = this;
			opts = opts || {};
			self._content = opts.content || "";
			self._title = opts.title || "";
			self._render();
			opts.id && self.setId( opts.id );
		},

		_render : function() {
			var self = this;
			self.el = $('<div />');

			self.el.addClass('ui-panel');

			self.el.append(
				$('<div />')
				.addClass('ui-panel-title')
				.append( self._title )
			);

			self.el.append(
				$('<div />')
				.addClass('ui-panel-content')
				.append( self._content )
			);
		},

		setId : function( id ) {
			this.el.data('panel-id', id);
		},

		getId : function() {
			return this.el.data('panel-id');
		},

		content : function( newContent ) {
			var self = this,
				content =  self.el.find('.ui-panel-content');
			if(arguments.length === 0) {
				return content;
			} else {
				content.html( newContent );
			}
		},

		title : function( newTitle ) {
			var self = this,
				title =  self.el.find('.ui-panel-title');
			if(arguments.length === 0) {
				return title;
			} else {
				title.html( newTitle );
			}
		}

	});

	return Panel;

});