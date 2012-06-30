define( [ "ui/widget" ], function( Widget ) {

	var Panel = Widget.$extend({

		__init__ : function( opts ) {
			var self = this;
			opts = opts || {};
			self.$super();
			self._generateId();
			self._content = opts.content || "";
			self._title = opts.title || "";
			self._render();
		},

		_render : function() {

			var self = this;

			self.$el.addClass('ui-panel');

			self.$el.append(
				$('<div />')
				.addClass('title')
				.append( self._title )
			);

			self.$el.append(
				$('<div />')
				.addClass('content')
				.append( self._content )
			);
		},

		content : function( newContent ) {
			var self = this,
				content =  self.$el.find('.content');
			if(arguments.length === 0) {
				return content;
			} else {
				content.html( newContent );
			}
		},

		title : function( newTitle ) {
			var self = this,
				title =  self.$el.find('.title');
			if(arguments.length === 0) {
				return title;
			} else {
				title.html( newTitle );
			}
		},

		_generateId : function() {
			this.setId( +Date()+Math.random()*10000 << 0 );
		},

		setId : function( id ) {
			this.$el.data('panel-id', id);
		},

		getId : function() {
			return this.$el.data('panel-id');
		}

	});

	return Panel;

});