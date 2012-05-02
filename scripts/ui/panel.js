define( [
		"libs/classy", "libs/text!ui/templates/panel.tpl",
		"libs/mustache", "libs/zepto.min"
	], 
	function( Class, template, Mustache ) {

	var Panel = Class.$extend({

		__init__ : function( opts ) {
			var self = this;
			opts = opts || {};
			self.content = opts.content || "";
			self.title = opts.title || "";
			self._render();
		},

		_render : function() {
			var self = this;
			self.el = $(Mustache.render( template, {
				content : self.content,
				title : self.title
			}));
		}

	});

	return Panel;

});