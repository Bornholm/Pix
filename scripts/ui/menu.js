define(["libs/classy", "libs/zepto.min"], function( Class ) {

	"use strict";

	var Menu = Class.$extend({

		__init__ : function( opts ) {
			
			opts = opts || {};
			var self = this;
			self.container = opts.container;
			self.items = opts.items || [];
			self.onItemClick = opts.itemClick || function() {};

			self._updateDOM();
			self._initEventHandlers();
		},

		_updateDOM : function() {
			var root, ul, li,
				self = this,
				items = self.items;
			root =  self._getMenuList( items );
			self.container.html( root );
		},

		_initEventHandlers : function() {

			var self = this,
				container = self.container;

			container.on({
				mouseover : function( evt ) {
					var target = $(evt.currentTarget);
					target.addClass("active");
					target.parents("li.ui-menu-item").addClass("active");
				},
				mouseout : function( evt ) {
					var target = $(evt.currentTarget);
					target.removeClass("active");
					target.parents("li.ui-menu-item").removeClass("active");
				},
				tap : function( evt ) {
					var target = $(evt.currentTarget);
					target.toggleClass("active");
					target.parents("li.ui-menu-item").toggleClass("active");
				}
			}, "li.ui-menu-item");

			container.on({

				"click" : function( evt ) {
					var item,
						target = $(evt.currentTarget),
						itemId = target.data("item-id");

					if( itemId ) {
						item = self._findMenuItem( itemId );
						if( item && !item.disabled ) {
							self.onItemClick( item );
						}
					}
				}

			}, "li.ui-menu-item" );
		},

		_getMenuList : function( items, subLevel ) {

			var self = this,
				ul = $("<ul />");
			subLevel = subLevel ? subLevel : 0;
			ul.addClass("ui-menu");
			ul.addClass("level-"+subLevel)
			$.each( items, function( index, item ) {
				var label,
					li = $("<li />");
					li.addClass("ui-menu-item");
					item.disabled && li.addClass("disabled");
					item._id = self._createItemId();
					li.data( "item-id", item._id );
				if( item.label ) {
					label = $("<span />");
					label.addClass("ui-menu-label");
					label.text( item.label );
					li.append( label );
				}
				$.isArray( item.items ) && li.append( self._getMenuList( item.items, subLevel+1 ) );
				ul.append( li );
			});
		
			return ul;
		},

		_createItemId : function() {
			return (Math.random()*100000>>1).toString(16)+
			"-"+
			(Math.random()*100000<<1).toString(16);
		},

		_findMenuItem : function( id, items ) {

			var item,
				self = this;

			items = items || self.items;

			$.each( items, function( ii, i ) {
				if (i._id === id) {
					item = i;
					return false;
				} else if( i.items ) {
					item = self._findMenuItem( id, i.items );
					if (item) {
						return false
					};
				}
			});

			return item;
		}

	});

	return Menu;

});