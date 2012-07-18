define(['core/action'], function() {

	var p;

	/******************
	 *	ActionManager
	 ******************/

	var ActionManager = function() {
		var self = this;
		self._redo = [];
		self._undo = [];
		self._ignoreMode = false;
	};

	p = ActionManager.prototype;

	p.register = function( action ) {
		!this._ignoreMode && this._undo.push( action );
	};

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