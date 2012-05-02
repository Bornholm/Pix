define( ["yajf/extension", "ui/panel"], function( Extension, Panel ) {

	"use strict";

	var PanelManager = Extension.$extend({

		__init__ : function( opts ) {

			opts = opts || {};

			var self = this;

			self._container = opts.container;
			self._modalLayer = opts.modalLayer;
			self._previousMousePos = {},
			self._isDragging = false;
			self._panels = [];

			self._initEventsHandlers();

		},

		getSandboxExtension : function() {
			var self = this;
			return {
				addPanel : self._addPanel.bind( self ),
				removePanel : self._removePanel.bind( self ),
				clear : self._clear.bind( self )
			};
		},

		_clear : function() {
			var container = this.container;
		},

		_removePanel : function( panel ) {
			panel.el.off();
			if( panel.el.hasClass('modal') ) {
				this._modalLayer.hide();
			}
			panel.el.remove();
		},

		_addPanel : function( panelContent, panelTitle, isDraggable, isModal ) {

			var self = this,
				panel = new Panel({
					content : panelContent,
					title : panelTitle
				});

			self._container.append( panel.el );
			self._panels.push( panel );

			isDraggable && panel.el.addClass("draggable");
			isModal && self._setModal( panel );

			return panel;
		},

		_setModal : function( panel ) {

			var box,
				self = this,
				width = $(window).width(),
				height = $(window).height(),
				modalLayer = self._modalLayer;

			modalLayer.show();

			panel.el.addClass('modal');
			
			box = panel.el.offset();
			panel.el.css({
				'z-index' : modalLayer.css('z-index')+1,
				left : width/2-box.width/2,
				top : height/2-box.height/2,
			});

		},

		_onStartDrag : function( evt ) {
			var self = this,
				target = $(evt.currentTarget).parent(".ui-panel");
			self._container.append( target );
			self._isDragging = true;
			return false;
		},

		_onStopDrag : function() {
			var self = this;
			self._isDragging = false; 
			self._previousMousePos = null;
			return false;
		},

		_onPanelDragging : function( evt ) {
			
			var target, prevPos, pos,
				self = this;

			if( self._isDragging ) {

				prevPos = self._previousMousePos;

				if( prevPos ) {
					target = $(evt.currentTarget).parent('.ui-panel');
					if( target.hasClass('draggable') ) {
						pos = target.offset();
						target.css({
							top : pos.top+ (evt.screenY - prevPos.y),
							left : pos.left+ (evt.screenX - prevPos.x),
						});
					}
				}

				self._previousMousePos = prevPos = prevPos || {};
				prevPos.x = evt.screenX;
				prevPos.y = evt.screenY;

				return false;
			}

		},

		_initEventsHandlers : function() {

			var self = this,
				container = self._container;

			//Dragging
			container.on({

				'mousedown' : self._onStartDrag.bind( self ),

				'mouseup' :  self._onStopDrag.bind( self ),

				'mouseout' :  self._onStopDrag.bind( self ),

				'mousemove' :  self._onPanelDragging.bind( self )

			}, ".ui-panel-title");

		}

	});


	return PanelManager;

});