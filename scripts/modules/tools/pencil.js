define(['modules/tools/toolbase'], function( ToolBase ) {
	
	var Pen = ToolBase.$extend({

		_toolDefinition : {
			id : 'draw',
			label : 'Pen', 
			icon : 'images/pencil.png'
		},

		start : function( opts ) {
			var self = this;
			self.$super( opts );

			self._isDrawing = false,
			self._prevPos = {};
			self._onDrawBinded = self._onDraw.bind( self );
			self._offDrawingBinded = self._offDrawing.bind( self );
			self._onDrawingBinded = self._onDrawing.bind( self );
		},

		activate : function() {

			var self = this,
				project = self._activeProject;

			$(document.body).on({
				'mousedown' : self._onDrawingBinded,
				'mousemove' : self._onDrawBinded,
				'mouseup' : self._offDrawingBinded
			}, '.project-layers');
		},

		deactivate : function() {
			var self = this,
				project = self._activeProject;
			
			$(document.body).off({
				'mousedown' : self._onDrawingBinded,
				'mousemove' : self._onDrawBinded,
				'mouseup' : self._offDrawingBinded
			}, '.project-layers');
		},

		_onDraw : function( evt ) {
			var coords,
				self = this,
				prevPos = self._prevPos,
				project = self._activeProject;

			if( self._isDrawing ) {
				coords = project.globalToLocal( evt.clientX, evt.clientY );
				project.line( coords.x, coords.y, prevPos.x, prevPos.y );
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