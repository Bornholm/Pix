define(["libs/classy", "libs/zepto.min"], function( Class ) {

	var MenuItem = Class.$extend({



	});

	var RadialMenu = Class.$extend({

		__init__ : function( opts ) {
			opts = opts || {};
			var self = this;

			self._isVisible = false;
			self._center = { x : 0, y : 0 };
			self._container = $("<div />").addClass("ui-radial-menu-container");

			self._initEventsHandlers( self._container );
			self._resetMenuDom();
			self._hideMenu();
		},

		_initEventsHandlers : function( container ) {
			var self = this;
			$(document).on("click", $.proxy( self._toggleMenu, self ) );
		},

		_showMenu : function() {
			this._container.show();
			this._updateMenuPosition();	
			this._isVisible  = true;
		},

		_hideMenu : function() {
			this._container.hide();
			this._isVisible  = false;
		},

		_updateMenuPosition : function() {
			var deltaX, deltaY, button,
				self = this,
				pos = self._center,
				container = self._container;

			button = container.find(".ui-radial-menu-button.center").first();
			deltaX = button.width()/2;
			deltaY = button.height()/2;

			button.css({
				position : "absolute",
				top : pos.y-deltaX,
				left : pos.x-deltaY
			});

		},

		_resetMenuDom : function() {
			var self = this,
				pos = self._center,
				container = self._container,
				button = $('<div />');

			container.empty();
			button.addClass("ui-radial-menu-button center");
			container.append( button );
			$(document.body).append( container );
		},		

		_toggleMenu : function( evt ) {

			var self = this;
			self._updateCenter( evt );
			if( !self._isVisible ) {
				self._showMenu();
			} else {
				self._hideMenu();
			}

		},

		_updateCenter : function( evt ) {
			this._center = {
				x : evt.clientX,
				y : evt.clientY
			};
		}		


	});

	return RadialMenu;

})