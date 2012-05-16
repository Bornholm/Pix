define( [ "yajf/module", "libs/zepto.min" ], function( Module ) {

	var Tools = Module.$extend({

		_iconMissing : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAs0lEQVR42t2TMQ6CMBSGuQAyE+/A0jh2MnEiEQNOqAwSuI3RBTkA14ArcKTyfvPyYjrR1Mnhoy3v/V8KaQNjjBefx7k47bJjOhAzrUOMoG3uB4C5VRuQEQG9GPt3d6G5RhNGZsvo7xp6kREB22M0rCRGRgRid0NbO3ATIOMl+O0nVLeydBUg80f/wH8HRZ5NbVPv14bRi4wIXs/HFWfb4TKNyIiA2BAJoXitmIhRVi3hTLAA+0/MeZEcmKUAAAAASUVORK5CYII=',

		start : function( opts ) {
			var self = this;
			opts = opts || {};
			self._tools = {};
			self._container = opts.container;
			self._initEventsHandlers();
			self._updateToolsView();
		},

		_initEventsHandlers : function() {
			var self = this,
				container = self._container,
				events = self.sandbox.events;

			// ModCom
			events.subscribe('tools:register', self._onToolRegister, self);
			events.subscribe('tools:unregister', self._onToolUnregister, self);

			//DOM
			container.on({
				click : self._onToolClick.bind( self )
			}, '.ui-toolsbox-tool' );

		},

		_getToolsView : function() {

			var toolId, tool, img,
				self = this,
				tools = self._tools,
				div = $('<div class="ui-toolsbox" />');

			for ( toolId in tools ) {
				if( tools.hasOwnProperty(toolId) ) {
					tool = tools[toolId];
					img = $('<img class="ui-toolsbox-tool" />');
					img.attr({
						src : tool.icon || self._iconMissing,
						title : tool.label || ''
					});
					img.data('tool-id', toolId);
					div.append( img );
				}
			}

			return div;
		},

		_updateToolsView : function() {
			this._container && this._container.html( this._getToolsView() );
		},

		_onToolClick : function( evt ) {

			var self = this,
				events = self.sandbox.events,
				target = $(evt.currentTarget),
				id = target.data('tool-id');

			if( id ) {
				self._container.find('.ui-toolsbox-tool').removeClass('selected');
				target.addClass('selected');
				events.publish('tools:select', [ id ]);
			}
			
		},

		_onToolRegister : function( id, label, icon ) {
			var self = this;
			self._tools[ id ] = {
				label : label,
				icon : icon
			};
			self._updateToolsView();
		},

		_onToolUnregister : function() {
			var self = this;
			delete self._tools[ id ];
			self._updateToolsView();
		}


	});

	return Tools;
});