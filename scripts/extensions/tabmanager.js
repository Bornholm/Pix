define(["yajf/extension"], function( Extension ) {
	
	"use strict";

	var TabManager = Extension.$extend({

		getSandboxExtension : function( opts ) {

			opts = opts || {};

			var self = this;

			self._container = $(opts.container);

			//self._initLayout();
			self._initEventHandlers();

			return {
				add : self._add.bind( self ),
				remove : self._remove.bind( self ) 
			};

		},

		_initLayout : function() {

			var self = this,
				tabs = $('<ul />'),
				content = $('<div />'),
				container = self._container;

			container.empty();

			tabs.addClass('tabs');

			content.addClass('content');

			container.append( tabs )
					 .append( content );
		},

		_initEventHandlers : function() {

			var self = this,
				container = self._container;

			container.on('click', '.tabs li', self._onTabClick.bind( self ) );
		},

		_onTabClick : function( evt ) {

			var self = this,
				contents = self._container.find('.content').children(),
				target = $(evt.currentTarget);

			if( !target.hasClass('current') ) {
				target.siblings('.current').removeClass('current');
				target.addClass('current');
				contents.removeClass('current');
				contents.eq( target.index() ).addClass('current');
			}

		},

		// return tab id
		_add : function( title, content, isCurrent ) {

			var self = this;


		},

		// remove tab by id
		_remove : function( id ) {

		},


	});

	return TabManager;

});