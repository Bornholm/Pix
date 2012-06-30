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

				add : self._add.bind( self ),
				reset : self._reset.bind( self ),
				center : self._center.bind( self ),
				remove : self._remove.bind( self ),
				clear : self._clear.bind( self ),
				maximize : self._maximize.bind( self ),
				restore : self._restore.bind( self ),
				minimize : self._minimize.bind( self ),
				modal : self._modal.bind( self ),
				unmodal : self._unmodal.bind( self ),
				draggable : self._draggable.bind( self ),
				undraggable : self._undraggable.bind( self ),
				focus : self._focus.bind( self )

			};

		},

		_clear : function() {
			this._container.empty();
			this._modalLayer.empty();
		},

		_remove : function( panel ) {

			var panels = this._panels,
				id = panel.getId(),
				len = panels.length;

			panel.$el.off();
			this._unmodal( panel );
			panel.$el.remove();

			//Remove panel from list
			while(len--) {
				if( panels[len].getId() === id ) {
					panels.splice( len, 1 );
					break;
				};	
			}

		},

		_reset : function( panel ) {
			var self = this,
				box = panel.$el.offset();
			!self._boundsContain( box.left, box.top, box.width, box.height ) && self._center( panel );
			panel.$el.parent().append( panel.el );
		},

		_add : function( panel, isDraggable ) {
			var self = this,
				events = self.sandbox.events;
			self._container.append( panel.el );
			self._updateCachedState( panel );
			self._panels.push( panel );
			events.publish("panel:focus", [ panel ] );
			return panel;
		},

		_modal : function( panel ) {
			var self = this,
				modalLayer = self._modalLayer;
			modalLayer.show();
			modalLayer.append( panel.el );
			panel.$el.addClass('modal');
		},

		_unmodal : function( panel ) {
			var self = this,
				modalLayer = self._modalLayer;
			if( panel.$el.hasClass('modal') ) {
				panel.$el.removeClass('modal');
				self._container.append( panel.el );
			}
			if( modalLayer.children().length === 0 ) {
				modalLayer.hide();
			}
		},

		_center : function( panel ) {
			var box = panel.$el.offset();
			panel.$el.css({
				left : '50%',
				top : '50%',
				'margin-left' : -box.width/2,
				'margin-top' : -box.height/2,
			});
		},

		_maximize : function( panel ) {
			panel.$el.css({
				left : '0px',
				top : '0px',
				height : '100%',
				width : '100%'
			});
			panel.$el.addClass('maximized');
		},

		_restore : function( panel ) {
			panel.$el.removeClass('maximized');
			panel.$el.css({
				left : panel._previousState.left,
				top : panel._previousState.top,
				height : panel._previousState.height,
				width : panel._previousState.width
			});
		},

		_minimize : function( panel ) {
			//TODO
		},

		_draggable : function( panel ) {
			panel.$el.addClass('draggable');
		},

		_undraggable : function( panel ) {
			panel.$el.removeClass('draggable');
		},

		_focus : function( panel ) {
			var self = this,
				events = self.sandbox.events;
			panel.$el.parent().find('.ui-panel.focused').removeClass('focused');
			panel.$el.parent().append( panel.el );
			panel.$el.addClass('focused');
			events.publish("panel:focus", [ panel ] );
		},

		_updateCachedState : function( panel ) {
			var offset = panel.$el.offset();
			panel._previousState = panel._previousState || {};
			panel._previousState.left = offset.left;
			panel._previousState.top = offset.top;
			panel._previousState.height = offset.height;
			panel._previousState.width = offset.width;
		},

		_initEventsHandlers : function() {

			var self = this,
				container = self._container;

			container.on({
				'mousedown' :  self._onStartDrag.bind( self ),
				'dblclick' : self._onSizeToggle.bind( self )
			},'.ui-panel .title');

			$(document).on({
				'mouseup' :  self._onStopDrag.bind( self ),
				'mousemove' :  self._onPanelDragging.bind( self )
			});

			// Focus
			container.on({
				'mousedown' : self._onFocus.bind( self )
			}, ".ui-panel" );

		},

		_onFocus : function( evt ) {
			var self = this,
				target = $(evt.currentTarget);
			self._focus( self._findPanelByElement( target ) );
		},

		_onSizeToggle : function( evt ) {
			var self = this,
				target = $(evt.currentTarget ).parent(),
				panel = self._findPanelByElement( target );

			if( target.hasClass('maximized') ) {
				self._restore( panel );
			} else {
				self._maximize( panel );
			}
			
		},

		_onStartDrag : function( evt ) {
			var self = this,
				target = $(evt.currentTarget).parent(".ui-panel");
			self._draggingTarget = target;
		},


		_onStopDrag : function() {
			var self = this;
			self._draggingTarget = null;
			self._previousMousePos = null;
		},

		_onPanelDragging : function( evt ) {
			
			var offset, x, y,
				panel,
				self = this,
				prevPos = self._previousMousePos,
				target = self._draggingTarget;

			if( target ) {

				if( prevPos && !target.hasClass('maximized') && target.hasClass('draggable') ) {

					offset = target.offset();

					y = offset.top + (evt.screenY - prevPos.y);
					x = offset.left + (evt.screenX - prevPos.x);
					
					if ( true || self._boundsContain( x, y, offset.width, offset.height ) ) {

						target.css({ 
							top : y, 
							left : x,
							margin : 0
						});

						panel = self._findPanelByElement( target );
						self._updateCachedState( panel );

					}
					
				}

				self._previousMousePos = prevPos = prevPos || {};
				prevPos.x = evt.screenX;
				prevPos.y = evt.screenY;

				return false;
				
			}

		},

		_boundsContain : function( x, y, width, height ) {
			var bounds = this._bounds;
			return (x >= bounds.left) && (y >= bounds.top) && (x+width <= bounds.right) && (y+height <= bounds.bottom);
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