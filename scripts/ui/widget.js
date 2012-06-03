define(['libs/classy'], function( Class ) {

	"use strict";

	var Widget = Class.$extend({

		__init__ : function() {
			var self = this,
				el = document.createElement( this.tag || "div" );
			el.className = "ui-widget" + (this.widgetClass ? " "+this.widgetClass : "");
			self.el = el;
			self.$el = $(el);
			self.bindEvents();
		},

		// From http://backbonejs.org/backbone.js View.delegateEvents

		_bindEventsSplitter : /^(\S+)\s*(.*)$/,

		bindEvents : function( events ) {

			var key, selector, 
				match, method,
				methodName, eventName,
				self = this,
				splitter = self._bindEventsSplitter,
				el = self.$el;
				
			events = events || this.events;
			self.unbindEvents();
			for ( key in events ) {
				if( events.hasOwnProperty( key ) ) {
					methodName = events[ key ];
					method = self[ methodName ];
					if( !method ) throw new Error('Method "' + methodName + '" does not exist !');
					match = key.match( splitter );
					eventName = match[1];
					selector = match[2];
					method =  method.bind( self );
					if( selector === '' ) {
						el.on( eventName, method );
					} else {
						el.on( eventName, selector, method  );
					}
				}
			}
		},

		unbindEvents : function() {
			this.$el.off();
		},

		globalToLocal : function( pageX, pageY, el ) {

			var self = this,
				el = el ? $(el) : self.$el,
				offset = el.offset(),
				coords = {};

			coords.x = pageX - offset.left;
			coords.y = pageY - offset.top;

			return coords;
		}
		
	});

	return Widget;

});