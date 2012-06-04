(function($) {
		var Todo = function(wrapper, opts) {
		
			/** Privates variables **/
			
			var _rawData,
				that = this,
				defaultHeaders = ["priority", "startDate", "text", "projects", "contexts"],
				priorityRegEx = /^\(([A-Z])\)\s{1}/,
				startDateRegEx = [ /(^\([A-Z]\)\s{1})((\d{4})-(\d{2})-(\d{2}))/, /^((\d{4})-(\d{2})-(\d{2}))/, /(^x\s{1})((\d{4})-(\d{2})-(\d{2}))/ ],
				projectRegEx = /\+([^\s]+)/g,
				contextRegEx = /@([^\s]+)/g,
				addOnRegEx = /([^\s]+):([^\s]+)/g,
				closedRegEx = /^x\s+/,
				ignore = that.ignore = ["raw"],
				headersAlias = that.headersAlias = {},
				contentTransform = that.contentTransform = {},
				separator = ", ";
	
			
			/** Privates Methods **/
			
			var _loadURL = function(url, opts) {
				
					opts = $.extend(opts || {}, {
						
						success : function(data) {
							_rawData = data;
							_processRawData();
							_sinkClosed();
							_sortBy("priority");
							_buildDOM();
						},
					
						error :  function() {
							//TODO _displayError();
						}
					
					});

					$.ajax(url, opts);
			},

			_loadLocal = function(text) {
				_rawData = text;
				_processRawData();
				_sinkClosed();
				_sortBy("priority");
				_buildDOM();
			},
			
			_sinkClosed = function() {
				var that = this,
					tasks = that.tasks;
				
				tasks.sort(function(a, b) {
					if(a.closed == b.closed) return 0;
					if(!a.closed && b.closed) return -1;
					if(a.closed && !b.closed) return 1;
				});
			},
			
			_sortBy = function(property) {
				var that = this,
					tasks = that.tasks;
				tasks.sort(function(a, b) {
					if( a[property].length + b[property].length === 0 ) return 0;
					if( a[property].length > 0 && b[property].length === 0 ) return -1;
					if( a[property].length === 0 && b[property].length > 0 ) return 1;
					return a[property][0] > b[property][0];
				});

			},
			
			_buildDOM = function() {
				element.empty();
				_buildControls();
				_buildTable();
			},
			
			_buildControls = function() {
				var container = $("<div>"),
					showClosedCheckBox = $("<input class='show-closed' type='checkbox'></input>")
					
				showClosedCheckBox.change(function() {
					$(".todo-table .closed").fadeToggle();
				});
				
				container.addClass("controls");
				container.append("<label>Show closed tasks</label>");
				container.append(showClosedCheckBox);
				element.append(container);
			},
			
			_buildTable = function() {
				var newRow, newCell,
					table = $("<table>"),
					rows = [];
					
				table.addClass("todo-table");
					
				// Headers
				newRow = $("<tr>");
				$.each(that.tasksHeaders, function(i, header) {
					if( ignore.indexOf(header) == -1 ) {
						newCell = $("<th>").text( headersAlias[header] ? headersAlias[header] : header );
						newCell.addClass(header);
						newRow.append(newCell);
					}
				});
				$.each(that.addonsHeaders, function(i, header) {
					if( ignore.indexOf(header) == -1 ) {
						newCell = $("<th>").text( headersAlias[header] ? headersAlias[header] : header );
						newCell.addClass(header);
						newRow.append(newCell);
					}
				});
				table.append(newRow);
				
				
				// Tasks Rows
				$.each($(that.tasks).filter(_doesTaskMatch), function(i, task) {

						newRow = $("<tr>");
						task.closed && newRow.addClass("closed");

						$.each(that.tasksHeaders, function(i, columnName) {
							if( ignore.indexOf(columnName) == -1 ) {
								var transform = contentTransform[columnName];
								cellValue = task[columnName];
								cellValue = $.isFunction(transform) ? transform(cellValue) : cellValue;
								newCell = $("<td>");
								cellValue && newCell.text( $.isArray(cellValue) ? cellValue.join(separator) : cellValue);
								newCell.addClass(columnName);
								newRow.append(newCell);
							}
						});

						$.each(that.addonsHeaders, function(i, columnName) {
							if( ignore.indexOf(columnName) == -1 ) {
								var transform = contentTransform[columnName];
								cellValue = task.addons[columnName];
								cellValue = $.isFunction(transform) ? transform(cellValue) : cellValue;
								newCell = $("<td>");
								cellValue && newCell.text( $.isArray(cellValue) ? cellValue.join(separator) : cellValue);
								newCell.addClass(columnName);
								newRow.append(newCell);
							}
						});

						rows[rows.length] = newRow;
				});
				
				table.append.apply(table, rows);
				
				element.append(table);
			},
			
			_processRawData = function() {
				
				var priority, projects, 
					contexts, addons,
					startDate,
					currentTask,
					raw = _rawData
					lines = raw.split("\n");
				
				that.tasks = tasks = [];
				that.tasksHeaders = headers = defaultHeaders.slice();
				that.addonsHeaders = addonsHeaders = [];
				
				
				// Remove empty lines
				lines = $(lines).filter(function(i, l) {
					return $.trim(l) != "";
				});
				
				$(lines).each(function(index, text) {
					
					currentTask = {};
					
					// Raw Text && init for cleaning
					currentTask.text = currentTask.raw = text;
					
					// Start Date

					currentTask.startDate = _extract(currentTask.raw, startDateRegEx[0], 2);
					currentTask.text = _erase(currentTask.text, startDateRegEx[0], 2);

					if( currentTask.startDate.length === 0) {
						currentTask.startDate = _extract(currentTask.raw, startDateRegEx[1]);
						currentTask.text = _erase(currentTask.text, startDateRegEx[1]);
					}
					if( currentTask.startDate.length === 0) {
						currentTask.startDate = _extract(currentTask.raw, startDateRegEx[2], 2);
						currentTask.text = _erase(currentTask.text, startDateRegEx[2], 2);
					}
					
					// Closed
					currentTask.closed = _extract(currentTask.raw, closedRegEx).length > 0 ? true : false;
					currentTask.text = _erase(currentTask.text, closedRegEx);
					
					// Priority
					currentTask.priority = _extract(currentTask.raw, priorityRegEx, 1);
					currentTask.text = _erase(currentTask.text, priorityRegEx);

					// Projects
					currentTask.projects = _extract(currentTask.raw, projectRegEx, 1);
					currentTask.text = _erase(currentTask.text, projectRegEx);
					
					// Contexts					
					currentTask.contexts = _extract(currentTask.raw, contextRegEx, 1);
					currentTask.text = _erase(currentTask.text, contextRegEx);
					
					// Add ons
					addons = _extract(currentTask.raw, addOnRegEx);
					if( addons ) {
						currentTask.addons = {};
						$.each( addons, function(i, add) {
							add = add.split(":");
							if( currentTask.addons[add[0]] ) {
								currentTask.addons[add[0]].push(add[1]);
							} else {
								currentTask.addons[add[0]] = [add[1]];
								addonsHeaders.indexOf(add[0]) === -1 && addonsHeaders.push(add[0]);
							}


						});
					}
					currentTask.text = _erase(currentTask.text, addOnRegEx);
					
					tasks[tasks.length] = currentTask;
				});
				
			},
			
			_extract = function(text, regExp, part) {
				var res,
					result = [];
					
				!$.isNumeric(part) && (part = 0);

				if( regExp.global ) {
					while ( (res = regExp.exec(text)) != null ) {
						result.push(res[part]);
					};
				} else {
					res = regExp.exec(text);
					res &&	result.push(res[part]); 
				}
				

				return result;
			},
			
			_erase = function(text, regExp, part) {
				var res;
				
				!$.isNumeric(part) && (part = 0);

				if( regExp.global ) {
					var toErase = [];
					while ( (res = regExp.exec(text)) != null ) {
						toErase.push(res[part]);
					};
					$.each(toErase, function( i, token ) {
						text = text.replace(token, ""); 
					});
				} else {
					res = regExp.exec(text);
					res &&	( text = text.replace(res[part], "") ); 
				}

				return text;
			},
			
			_doesTaskMatch = function(task) {
				return true;
			};
			
			
			/** Public Methods **/
			
			this.reload = function(opts) {
				opts = opts || {};
				opts.headersAlias && $.extend(headersAlias, opts.headersAlias);
				opts.contentTransform && $.extend(contentTransform, opts.contentTransform);
				opts.separator && (separator = opts.separator);
				opts.ignore && ( ignore = ignore.concat( opts.ignore ) ) ;
				opts.url && _loadURL(opts.url, opts.xhr);
				opts.local && _loadLocal(opts.local);
			};
			
			/** Init **/
			
			element = $("<div class='todo'></div>").appendTo($(wrapper)),
			this.reload(opts);
		};
		
		
		$.fn.todo = function(opts) {
			
			return this.each(function() {
				var element = $(this);
				
				if( element.data('todo') ) return;
				
				var todo = new Todo(this, opts);
				
				element.data('todo', todo);
			});
			
		};

})(jQuery);
