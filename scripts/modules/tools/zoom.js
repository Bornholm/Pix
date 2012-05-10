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
			self._onClickBinded = self._onClick.bind( self );
		},

		activate : function() {
			var self = this;
			$(document.body).on({
				'click' : self._onClickBinded,
			}, '.project-layers');
		},

		deactivate : function() {
			var self = this;
			$(document.body).off({
				'click' : self._onClickBinded,
			}, '.project-layers');
		},

		_onClick : function() {
			var zoom,
				self = this,
				project = self._activeProject;

			if( project ) {
				zoom = project.zoom();
				project.zoom(zoom+1);
			}
		}


	});

	return Zoom;

});