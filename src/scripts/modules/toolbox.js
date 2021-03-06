define( [ "core/subscriber", "libs/zepto.min" ], function( Module ) {

	var Tools = Module.$extend({

		_iconMissing : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAs0lEQVR42t2TMQ6CMBSGuQAyE+/A0jh2MnEiEQNOqAwSuI3RBTkA14ArcKTyfvPyYjrR1Mnhoy3v/V8KaQNjjBefx7k47bJjOhAzrUOMoG3uB4C5VRuQEQG9GPt3d6G5RhNGZsvo7xp6kREB22M0rCRGRgRid0NbO3ATIOMl+O0nVLeydBUg80f/wH8HRZ5NbVPv14bRi4wIXs/HFWfb4TKNyIiA2BAJoXitmIhRVi3hTLAA+0/MeZEcmKUAAAAASUVORK5CYII=',

		subs : {
			'toolbox:register' : '_onToolRegister',
			'toolbox:unregister' : '_onToolUnregister'
		},

		start : function( opts ) {
			var self = this;
			self.$super( opts );
			opts = opts || {};
			self._tools = {};
			self._buttonsContainer = opts.buttonsContainer;
			self._optionsContainer = opts.optionsContainer;
			self._initEventsHandlers();
			self._updateToolsView();
		},

		_initEventsHandlers : function() {

			var self = this,
				container = self._buttonsContainer;

			//DOM
			container.on({
				click : self._onToolClick.bind( self )
			}, '.ui-toolbox-tool' );

		},

		_getToolsView : function() {

			var toolId, tool, img,
				self = this,
				tools = self._tools,
				div = $('<div class="ui-toolbox" />');

			for ( toolId in tools ) {
				if( tools.hasOwnProperty(toolId) ) {
					tool = tools[toolId];
					img = $('<img class="ui-toolbox-tool" />');
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
			this._buttonsContainer && this._buttonsContainer.html( this._getToolsView() );
		},

		_onToolClick : function( evt ) {

			var self = this,
				target = $(evt.currentTarget),
				id = target.data('tool-id'),
				tool = self._tools[ id ];

			if( id ) {
				self._buttonsContainer.find('.ui-toolbox-tool').removeClass('selected');
				target.addClass('selected');
				self._optionsContainer.html( tool.options );
				self.publish('toolbox:select', [ id ]);
			}
			
		},

		_onToolRegister : function( id, label, icon, options ) {
			var self = this;
			self._tools[ id ] = {
				label : label,
				icon : icon,
				options : options
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