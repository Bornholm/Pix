define(['modules/tools/toolbase'], function( ToolBase ) {
	
	var Pen = ToolBase.$extend({

		_toolDefinition : {
			id : 'draw',
			label : 'Pen', 
			icon : 'images/pencil.png'
		},

		start : function( opts ) {

			var self = this,
				events = self.sandbox.events;

			self.$super( opts );

			self._eraseMode = false;
			self._isDrawing = false,
			self._prevPos = {};
			self._onDrawBinded = self._onDraw.bind( self );
			self._offDrawingBinded = self._offDrawing.bind( self );
			self._onDrawingBinded = self._onDrawing.bind( self );
			self._onPixelClickBinded = self._onPixelClick.bind( self );

		},

		activate : function() {
			var self = this;
			$(document.body).on({
				'click' : self._onPixelClickBinded,
				'mousedown' : self._onDrawingBinded,
				'mousemove' : self._onDrawBinded,
				'mouseup' : self._offDrawingBinded
			}, '.layers');
		},

		deactivate : function() {  
			var self = this;
			$(document.body).off({
				'click' : self._onPixelClickBinded,
				'mousedown' : self._onDrawingBinded,
				'mousemove' : self._onDrawBinded,
				'mouseup' : self._offDrawingBinded
			}, '.layers');
		},

		_onPixelClick : function( evt ) {

			var coords,
				self = this,
				lineOrigin = self._lineOrigin,
				project = self._activeProject;

			coords = project.globalToLocal( evt.pageX, evt.pageY, evt.srcElement );

			if( evt.shiftKey && lineOrigin ) {
				project.line( lineOrigin.x, lineOrigin.y, coords.x, coords.y, self._eraseMode );
			} else {
				project.setPixel( coords.x, coords.y , self._eraseMode );				
			}

			self._lineOrigin = coords;
			
			
		},

		_onDraw : function( evt ) {

			var coords,
				self = this,
				prevPos = self._prevPos,
				project = self._activeProject;

			if( self._isDrawing ) {
				coords = project.globalToLocal( evt.pageX, evt.pageY, evt.srcElement );
				project.line( coords.x, coords.y, prevPos.x, prevPos.y, self._eraseMode );
				prevPos.x = coords.x;
				prevPos.y = coords.y;
			}

			return false;
		},

		_offDrawing : function() {
			var self = this;
			self._isDrawing = false;
			delete self._prevPos.x;
			delete self._prevPos.y;
			return false;
		},

		_onDrawing : function( evt ) {
			var self = this;
			self._isDrawing = true;
			self._onDraw( evt );
			return false;
		}


	});

	return Pen;

});