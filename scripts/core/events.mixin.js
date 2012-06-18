define({
	
	// From http://backbonejs.org/backbone.js View.delegateEvents

	_bindEventsSplitter : /^(\S+)\s*(.*)$/,

	bindEvents : function( events, el ) {

		var key, selector, 
			match, method,
			methodName, eventName,
			self = this,
			splitter = self._bindEventsSplitter;
			
		el = el || self.$el;
		events = events || this.events;

		self.unbindEvents( el );

		for ( key in events ) {
			if( events.hasOwnProperty( key ) ) {
				methodName = events[ key ];
				method = self[ methodName ];
				if( !method ) throw new Error('Method "' + methodName + '" does not exist !');
				match = key.match( splitter );
				eventName = match[1];
				selector = match[2];
				method =  method.bind( self );
				if( selector === '' ) {
					el.on( eventName, method );
				} else {
					el.on( eventName, selector, method  );
				}
			}
		}
	},

	unbindEvents : function( el ) {
		(this.$el || el).off();
	}


})