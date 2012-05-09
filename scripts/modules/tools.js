define( [ "yajf/module", "libs/zepto.min" ], function( Module ) {

	var Tools = Module.$extend({

		_iconMissing : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAs0lEQVR42t2TMQ6CMBSGuQAyE+/A0jh2MnEiEQNOqAwSuI3RBTkA14ArcKTyfvPyYjrR1Mnhoy3v/V8KaQNjjBefx7k47bJjOhAzrUOMoG3uB4C5VRuQEQG9GPt3d6G5RhNGZsvo7xp6kREB22M0rCRGRgRid0NbO3ATIOMl+O0nVLeydBUg80f/wH8HRZ5NbVPv14bRi4wIXs/HFWfb4TKNyIiA2BAJoXitmIhRVi3hTLAA+0/MeZEcmKUAAAAASUVORK5CYII=',

		start : function( opts ) {
			var self = this;
			opts = opts || {};
			self._tools = {};
			self._initEventsHandlers();
		},

		_initEventsHandlers : function() {
			var self = this,
				events = self.sandbox.events;
			events.subscribe('menu:item:click', self._onMenuItemClick, self);
			events.subscribe('tools:register', self._onToolRegister, self);
			events.subscribe('tools:unregister', self._onToolUnregister, self);
			events.subscribe('project:new', self._showToolsBox, self);
		},

		_onMenuItemClick : function( menuItem ) {
			if( menuItem.id === "toolset" ) {
				this._showToolsBox();
			}
		},

		_showToolsBox : function() {
			var self = this,
				panels = self.sandbox.panelsManager;
			if ( self._panel ) {
				panels.restore( self._panel );
				self._updateToolsView();
			} else {
				self._panel = panels.create( self._getToolsView(), "Toolbox", true);
				self._initDOMListeners( self._panel.el );
			}
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
			this._panel && this._panel.content( this._getToolsView() );
		},

		_initDOMListeners : function( container ) {
			var self = this;
			container.on({
				click : self._onToolClick.bind( self )
			}, '.ui-toolsbox-tool' );
		},

		_onToolClick : function( evt ) {

			var self = this,
				events = self.sandbox.events,
				target = $(evt.currentTarget),
				id = target.data('tool-id');

			if( id ) {
				self._panel.el.find('.ui-toolsbox-tool').removeClass('selected');
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
		},


	});

	return Tools;
});