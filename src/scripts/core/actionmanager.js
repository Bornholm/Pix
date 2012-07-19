define(['core/action'], function() {

	var p;

	/****************
	 * ActionStack
	 ****************/

	var ActionStack = function() {
		this._actions = []
	};

	p = ActionStack.prototype;

	p.add = function( action ) {
		this._actions.push( action );
	};

	p.redo = function() {
		var i, actions = this._actions;
		for( i = actions.length-1; i >= 0; --i ) {
			actions[i].redo();
		}
	};

	p.undo = function() {
		var i, actions = this._actions;
		for( i = actions.length-1; i >= 0; --i ) {
			actions[i].undo();
		}
	};

	/******************
	 *	ActionManager
	 ******************/

	var ActionManager = function() {
		var self = this;
		self._redo = [];
		self._undo = [];
		self._currentStack = new ActionStack();
		self._ignoreMode = false;
	};

	p = ActionManager.prototype;

	p.register = function( action, stack ) {

		var lastAction,
			self = this,
			undo = self._undo;

		stack = stack !== undefined ? stack : false;

		if( !self._ignoreMode ) {

			if( stack ) {
				if( undo.length >= 1 ) {
					lastAction = undo[undo.length-1];
					if( lastAction instanceof ActionStack ) {
						lastAction.add( action );
					} else {
						lastAction = new ActionStack();
						lastAction.add( action );
						undo.push( lastAction );
					}
				} else {
					lastAction = new ActionStack();
					lastAction.add( action );
					undo.push( lastAction );
				}
			
			} else {
				undo.push( action );
			}

			console.log( action, stack );
		}

		
	};

	p.close

	p.clear = function() {
		this._redo.length = this._undo.length = 0;
	};

	p.undo = function() {

		var action,
			self = this;
		if( self.hasUndo() ) {
			action = self._undo.pop();
			self._ignoreMode = true;
			action.undo();
			self._ignoreMode = false;
			self._redo.push( action );
		}

	};

	p.redo = function() {

		var action,
			self = this;
		if( self.hasRedo() ) {
			action = self._redo.pop();
			self._ignoreMode = true;
			action.redo();
			self._ignoreMode = false;
			self._undo.push( action );
		}

	};

	p.getUndoActions = function() {
		return this._undo;
	};

	p.getRedoActions = function() {
		return this._redo;
	};

	p.hasRedo = function() {
		return this._redo.length > 0;
	};

	p.hasUndo = function() {
		return this._undo.length > 0;
	};

	return ActionManager;
	
});