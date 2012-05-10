// Require PubSub Extension

define( ["yajf/extension", "ui/panel"], function( Extension, Panel ) {

	"use strict";

	var PanelManager = Extension.$extend({

		getSandboxExtension : function( opts ) {

			opts = opts || {};

			var self = this;

			self._container = opts.container;
			self._modalLayer = opts.modalLayer;

			self._bounds = opts.bounds || {
				top : 0,
				left : 0,
				right : $(window).width(),
				bottom : $(window).height()
			};

			self._previousMousePos = {},
			self._draggingTarget = null;
			self._panels = [];
			self._nextId = 0;

			self._initEventsHandlers();

			// Expose API
			return {

				create : self._add.bind( self ),
				restore : self._restore.bind( self ),
				center : self._center.bind( self ),
				remove : self._remove.bind( self ),
				clear : self._clear.bind( self )

			};

		},

		_clear : function() {
			var container = this.container;
		},

		_remove : function( panel ) {
			panel.el.off();
			if( panel.el.hasClass('modal') ) {
				this._modalLayer.hide();
			}
			panel.el.remove();
		},

		_restore : function( panel ) {
			var self = this,
				box = panel.el.offset();
			!self._boundsContain( box.left, box.top, box.width, box.height ) && self._center( panel );
			self._container.append( panel.el );
		},

		_add : function( panelContent, panelTitle, isDraggable, isModal ) {

			var self = this,
				events = self.sandbox.events,
				panel = new Panel({
					id : self._nextId++,
					content : panelContent,
					title : panelTitle
				});

			self._container.append( panel.el );
			self._panels.push( panel );

			isDraggable && panel.el.addClass("draggable");
			isModal && self._setModal( panel );

			self._setFocus( panel );

			events.publish("panel:focus", [ panel ] );

			return panel;
		},

		_setModal : function( panel ) {

			var self = this,
				modalLayer = self._modalLayer;

			modalLayer.show();
			panel.el.addClass('modal');
			self._center( panel );
			panel.el.css('z-index', modalLayer.css('z-index')+1);
		},

		_center : function( panel ) {
			var box = panel.el.offset();
			panel.el.css({
				left : '50%',
				top : '50%',
				'margin-left' : -box.width/2,
				'margin-top' : -box.height/2,
			});
		},

		_updateBounds : function() {

		},

		_initEventsHandlers : function() {

			var self = this,
				container = self._container;

			//Dragging
			container.on({
				'mousedown' : self._onStartDrag.bind( self ),
			}, ".ui-panel-title" );

			$(document).on({
				'mousemove' :  self._onPanelDragging.bind( self ),
				'mouseup' :  self._onStopDrag.bind( self )
			});

			// Focus
			container.on({
				'mousedown' : self._onFocus.bind( self )
			}, ".ui-panel" );

		},

		_onFocus : function( evt ) {
			var self = this,
				target = $(evt.currentTarget);
			self._setFocus ( self._findPanelByElement( target ) );
		},

		_setFocus : function( panel ) {

			var self = this,
				events = self.sandbox.events;
			self._container.find('.ui-panel').removeClass('active');
			self._container.append( panel.el );
			panel.el.addClass('active');
			events.publish("panel:focus", [ panel ] );
		},

		_onStartDrag : function( evt ) {
			var self = this,
				target = $(evt.currentTarget).parent(".ui-panel");
			self._draggingTarget = target;
			return false;
		},


		_onStopDrag : function() {
			var self = this;
			self._draggingTarget = null;
			self._previousMousePos = null;
			return false;
		},

		_onPanelDragging : function( evt ) {
			
			var pos, x, y,
				self = this,
				prevPos = self._previousMousePos,
				target = self._draggingTarget;

			if( target ) {

				if( prevPos && target.hasClass('draggable') ) {
					pos = target.offset();

					y = pos.top+ (evt.screenY - prevPos.y);
					x = pos.left+ (evt.screenX - prevPos.x);
					
					self._boundsContain( x, y, pos.width, pos.height ) && target.css({ top : y, left : x });
					
				}

				self._previousMousePos = prevPos = prevPos || {};
				prevPos.x = evt.screenX;
				prevPos.y = evt.screenY;
				
			}

			return false;

		},

		_boundsContain : function( x, y, width, height ) {
			var bounds = this._bounds;
			return x >= bounds.left && y >= bounds.top && x+width <= bounds.right && y+height <= bounds.bottom;
		},

		_findPanelByElement : function( el ) {

			var self = this,
				panels = self._panels,
				id = el.data('panel-id'),
				len = panels.length;

			while(len--) {
				if( panels[len].getId() === id) return panels[len];	
			}

		}



	});


	return PanelManager;

});