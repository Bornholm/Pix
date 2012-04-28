define( ['libs/classy', 'yajf/sandbox'], function( Class, Sandbox ) {

	"use strict;"

	var Core = Class.$extend({

		__init__ : function( opts ) {

			opts = opts || {};

			this._modules = {};
			this._modulesInstances = {};
			this._extensions = {};
			this._sandboxClass = opts.sandbox || Sandbox; 
		},


		registerModule : function( moduleId, Module ) {
			this._modules[ moduleId ] = Module;
		},

		startModule : function( moduleId, options ) {
			var module,
				self = this,
				Sandbox = self._sandboxClass,
				Module = self._modules[ moduleId ];
			if( Module) {
				module = new Module( new Sandbox() );
				module.start( options );
				self._modulesInstances[ moduleId ] = module;
			}
		},

		stopModule : function( moduleId, options ) {
			var self = this,
				module = self._modulesInstances[ moduleId ];
			if( module ) {
				module.stop( options );
				delete self._modulesInstances[ moduleId ];
			}
		},

		startAllModules : function( options ) {
			var moduleId,
				self = this,
				modules = self._modules;
			for (moduleId in modules) {
				modules.hasOwnProperty( moduleId ) && self.startModule( moduleId, options );
			}
		},

		stopAllModules : function( options ) {
			var moduleId,
				self = this,
				instances = self._modulesInstances;
			for (moduleId in instances) {
				instances.hasOwnProperty( moduleId ) && self.stopModule( moduleId, options );
			}
		},

		registerExtension : function( extensionName, Extension, options ) {
			var ext,
				self = this,
				sandboxExtension = {},
				Sandbox = self._sandboxClass;
			ext = new Extension( options );
			sandboxExtension[ extensionName ] = ext.getSandboxExtension();
			self._sandboxClass = Sandbox.$extend( sandboxExtension );
			
		}

	});

	return Core;

});