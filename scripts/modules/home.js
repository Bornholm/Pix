define(['yajf/module', 'core/events.mixin', 'libs/marked'], function( Module, EventsMixin, marked ) {
	
	return Module.$extend({

		__include__ : [ EventsMixin ],


		ext : 'md',

		events : {
			'click a[href^="md!"]' : '_onMarkdownLinkClick'
		},

		start : function() {

			var self = this,
				tabMan = self.sandbox.tabsManager;

			self._onMarkdownLoadedBound = self._onMarkdownLoaded.bind( self );
			self.$el = $('<div />').add('docs');
			tabMan.add( 'Home', self.$el, true );

			self.bindEvents();
			self._loadMarkdown( 'README' );
		},

		_onMarkdownLinkClick : function( evt ) {
			var md = $(evt.target).attr('href').replace( 'md!', '' );
			this._loadMarkdown( md );
			evt.preventDefault();
		},

		_loadMarkdown : function( ressource ) {
			var self = this;
			$.get( ressource + '.'+ self.ext, self._onMarkdownLoadedBound );
		},

		_onMarkdownLoaded : function( text ) {
			var self = this;
			self.$el.html( marked( text ) );
		}


	});

})