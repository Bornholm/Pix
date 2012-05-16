define(['modules/tools/toolbase'], function( ToolBase ) {

	"use strict";
	
	var Zoom = ToolBase.$extend({

		_toolDefinition : {
			id : 'zoom',
			label : 'Zoom', 
			icon : 'images/zoom.png'
		},

		start : function( opts ) {

			var self = this;
			self.$super( opts );
			self._zoom = 1;

			self._onClickBinded = self._onClick.bind( self );
			self._onZoomToggleBinded = self._onZoomToggle.bind( self );


			self._updateOptions();
		},

		activate : function() {
			var self = this,
				options = self._toolOptions;

			$(document.body).on({

				'click' : self._onClickBinded

			}, '.project-layers');

			options.on('click', '.zoom-button', self._onZoomToggleBinded );
		},

		deactivate : function() {

			var self = this,
				options = self._toolOptions;

			$(document.body).off({

				'click' : self._onClickBinded

			}, '.project-layers');

			options.off('click', '.zoom-button', self._onZoomToggleBinded );
		},

		_updateOptions : function() {

			var zoomOut, zoomIn,
				self = this,
				options = self._toolOptions;

			options.empty();

			zoomIn = $('<div />').addClass('zoom-button toggle-button');
			zoomOut = zoomIn.clone();

			if (self._zoom >= 0) {
				zoomIn.addClass('selected');
			} else {
				zoomOut.addClass('selected');
			}

			zoomIn.data( 'zoom-type', '+' );
			zoomOut.data( 'zoom-type', '-' );

			zoomIn.html('+');
			zoomOut.html('-');

			options.append( zoomIn ).append( zoomOut );

		},

		_onZoomToggle : function( evt ) {

			var self = this,
				target = $(evt.currentTarget),
				zoomType = target.data('zoom-type');

			switch( zoomType ) {
				case "+":
					self._zoom = 1;
					break;
				case "-":
					self._zoom = -1;
					break;
			}

			self._updateOptions();
		},

		_onClick : function() {
			var zoom,
				self = this,
				project = self._activeProject;

			if( project ) {
				zoom = project.zoom();
				if( zoom+self._zoom <= 0 ) return;
				project.zoom(zoom+self._zoom);
			}
		}


	});

	return Zoom;

});