define(function() {
	
	var p,
		noOp = function() {};

	/************
	 *	Action
	 ************/


	/*	redo/undo : {
			description : ""
			method : function, -> required
			context : context, -> required
			args : []
		}
	 */

	var toString = Object.prototype.toString,
		isString = function(obj) {
			return toString.call(obj) === '[object String]';
		};

	var Action = function( redo, undo ) {
		var self = this;
		redo = self._defaults( redo );
		undo = self._defaults( undo );;
		self._redo = redo;
		self._undo = undo;
	};

	p = Action.prototype;

	p._defaults = function( d ) {
		d = d || {};
		d.description = d.description !== undefined ? d.description : "";
		d.method = d.method || noOp;
		d.context = d.context !== undefined ? d.context : null;
		d.args = d.args !== undefined ? d.args : [];
		return d;
	};

	p.redo = function() {
		var redo = this._redo;
		(isString( redo.method ) ? redo.context[redo.method] : redo.method).apply( redo.context, redo.args );
	};

	p.undo = function() {
		var undo = this._undo;
		(isString( undo.method ) ? undo.context[undo.method] : undo.method).apply( undo.context, undo.args );
	};

	return Action;

});