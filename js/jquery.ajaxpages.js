;(function($){
	/* Detect Firebug.*/
	if(!window.console||window.console&&!window.console.firebug){
		console.log = function(){};
		console.warn = function(){};
		console.info = function(){};
		console.assert = function(){};
		console.dir = function(){};
		console.dirxml = function(){};
		console.trace = function(){};
		console.group = function(){};
		console.groupEnd = function(){};
		console.time = function(){};
		console.timeEnd = function(){};
		console.profile = function(){};
		console.profileEnd = function(){};
		console.count = function(){};
	}
	
	/* Default values */
	$.ajaxpages_defaultoptions = {
		/* No trailing slash! */
		ajax_base: 'ajax',
		/* Setting this too low will cause
		 * All hell to break loose. Seriously, don't
		 * go lower than 250. It's responsive enough 
		 * at 300. But if you set it too high, you might
		 * as well not even use this plugin.
		 */
		update_freq: 300,
		ajax_type: 'GET',
		ajax_cache: true,
		/* This should almost always be html */
		ajax_dataType: 'html',
		default_hash: '',
		loadingContainer: '#ajaxpages_loading',
		/* I figured someone out there would want to
		 * expand on the way I do things, and in order
		  * to keep the flying daggers to a minimum, I
		  * have included these not so helpful callbacks.
		  */
		beforeLoadCallback: function(XMLHttpRequest){},
		onErrorCallback: function(XMLHttpRequest, textStatus, errorThrown){},
		onSuccessCallback: function(html){}
	};
	
	/* Running Vars
	 * These Vars are used for various tasks
	 * such as storing the last updated content etc.
	 */
	$.ajaxpages_rv = {
		has_init: false,
		init_settings: {},
		init_clone: null,
		t_timeout: null,
		last_hash: '',
		current_hash: ''
	}
	
	/* Main function
	 * Starts the hash checking loop if it
	 * hasn't already.
	 */
	$.fn.ajaxpages_init = function(options){
		$.ajaxpages_rv.init_settings = $.extend({},$.ajaxpages_defaultoptions,options || {});
		$.ajaxpages_rv.init_clone = this;
		if($.ajaxpages_rv.init_settings.default_hash != ''){
			window.location.hash = '#' + $.ajaxpages_rv.init_settings.default_hash;
		}
		/* Why? No idea. */
		if(!$.ajaxpages_rv.has_init){
			$.ajaxpages_hashloop();
		}
	};
	
	/* Hash loop
	 * Checks the url hash and checks for changes
	 * If there is a change, the corresponding url
	 * is called and the resulting content is then loaded
	 * into the ajax div. If there are any other page changes
	 * IE: title change, description etc, they will be executed
	 * as well.
	 */
	$.ajaxpages_hashloop = function(){
		if(window.location.hash.substr(1) != $.ajaxpages_rv.current_hash){
			/* Hash has changed
			 * Change the hash then call the hash url via ajax and perform update methods.
			 */
			$.ajaxpages_rv.last_hash = $.ajaxpages_rv.current_hash;
			$.ajaxpages_rv.current_hash = window.location.hash.substr(1);
			console.log('Hash changed to: ' + $.ajaxpages_rv.current_hash + ' from ' + $.ajaxpages_rv.last_hash);
			
			$.ajax({
				type: $.ajaxpages_rv.init_settings.ajax_type.toUpperCase(),
				url: $.ajaxpages_rv.init_settings.ajax_base + $.ajaxpages_rv.current_hash,
				dataType: $.ajaxpages_rv.init_settings.ajax_dataType,
				cache: $.ajaxpages_rv.init_settings.ajax_cache,
				/* Here's your damn callbacks */
				success: function(html){
					$.ajaxpages_rv.init_settings.onSuccessCallback(html);
					$.ajaxpages_updatePage(html);
					$($.ajaxpages_rv.init_settings.loadingContainer).hide();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					console.error(textStatus);
					$.ajaxpages_rv.init_settings.onErrorCallback(XMLHttpRequest, textStatus, errorThrown);
					$($.ajaxpages_rv.init_settings.loadingContainer).hide();
				},
				beforeSend: function(XMLHttpRequest){
					$($.ajaxpages_rv.init_settings.loadingContainer).show();
					$.ajaxpages_rv.init_settings.beforeLoadCallback(XMLHttpRequest);
				}
			});
		}
		$.ajaxpages_rv.t_timeout = setTimeout(function(){$.ajaxpages_hashloop()},$.ajaxpages_rv.init_settings.update_freq);
	};
	
	/* Update Function
	 * Updated the page with result html from the ajax call.
	 */
	$.ajaxpages_updatePage = function(html){
		$($.ajaxpages_rv.init_clone).html(html);
	};
	
	/* Sets Page Title
	 * This function is for those lazy people out there
	 * who don't want to use document.title = 'title'
	 * I supposed since you're using jquery, you might as well
	 * go all the way right? RIGHT?
	 */
	$.ajaxpages_set_title = function(page_title){
		document.title = page_title;
		console.log('Updated page title to: ' + page_title);
	};
})(jQuery);