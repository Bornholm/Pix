define(['libs/classy'], function( Class ) {

	//TODO Vérifier si la création d'un nouveau worker est nécessaire à chaque appel de run()
	
	var AsyncTask = Class.$extend({

		_workerOnMessage : function( event ) { 
			var res,
				data = event.data;
			if( data.type === 'asynctask' ) {
				res = task.apply( this, data.args || [] );
				postMessage({ type : 'asynctask', result : res });
			};
			close();
		},

		__init__ : function( taskFunc ) {
			var self = this;
			self._taskFunc = taskFunc;
			self._buildTaskURL();
		},

		_buildTaskURL : function() {
			var self = this,
				taskFunc = self._taskFunc,
				blobBuilder = self._getBlobBuilder(),
				urlBuilder = self._getURLBuilder();

			blobBuilder.append( 'onmessage='+self._workerOnMessage.toString()+';' );
			blobBuilder.append( 'task='+taskFunc.toString() );
			self._taskURL = urlBuilder.createObjectURL( blobBuilder.getBlob() );
		},

		_getBlobBuilder : function() {
			return new ( window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder )();
		},

		_getURLBuilder : function() {
			return window.URL || window.webkitURL;
		},

		run : function( args, onComplete, onError ) {
			var self = this,
				worker = new Worker( self._taskURL );
			onComplete && ( worker.onmessage = self._getOnCompleteWrapper( onComplete, onError ) );
			onError && ( worker.onerror = onError );
			worker.postMessage({ type : 'asynctask', args : args });
		},

		_getOnCompleteWrapper : function( onComplete, onError ) {
			return function( event ) {
				var data = event.data;
				if( data.type === 'asynctask' ) {
					onComplete && onComplete( data.result );
				} else {
					onError && onError( 'Unknown Error' );
				}
			};
		}

	});

	return AsyncTask;

});