define( ["yajf/extension", "libs/mustache"], function( Extension, Mustache ) {

	var Template = Extension.$extend({

		getSandboxExtension : function() {
			return Mustache;
		}

	});

	return Template;

});