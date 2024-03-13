/*****************************************************
 *
 *     Stageone Cookie Plugin
 *
 ******************************************************/

// remap jQuery to $
( function( $, window, document, undefined ) {

	"use strict";


	//
	// Variables
	//

	var pluginName 		= "soCookies",
		defaults 		= {tagManagerLoaded: false, tagManagerID: '', clxCookieNoteSet: false};

	//
	// Plugin Constructor
	//
	function stageonePlugin ( element, settings ) {

		this.plugin			= this;
		this.element 		= element;
		this.settings 		= $.extend( {}, defaults, settings );
		this.defaults 		= defaults;
		this.name 			= pluginName;

		this.init();
	}

	$.extend( stageonePlugin.prototype, {

		//
		// Init
		//

		init: function() {

			//console.log(this.element);
			//console.log(this.settings);
			//console.log(this.name);

			// Cloudrexx cookies
			this.cloudrexxCookies();

			// Init Checkbox Switcher
			this.switchCkbSwitcher();


		},

		//
		// Cloudrexx init
		//

		cloudrexxCookies : function() {

			var plugin = this.plugin;

			// check if cookie settings are already done, still valid
			if( cx.privacy.cookies.isConsentSet() == true ) {
				plugin.settings.clxCookieNoteSet = true;
			}

			// Hide the "necessary cookies" switch
			$.each($('#cookie-cat-switcher-container-1'), function(key,switcher) {
				$(switcher).addClass('uk-hidden');
			});

			// Handle the cookie pop up
			if( plugin.settings.clxCookieNoteSet == false ) {

				// clx cookie note is visible

				// show cookie banner
				$('#cookie-banner').removeClass('uk-hidden');

				// hide cookie banner icon
				//$('#cookie-banner-icon').addClass('uk-hidden');

			} else {

				// clx cookie note is hidden

				// show cookie banner icon
				//$('#cookie-banner-icon').removeClass('uk-hidden');

			}

			// handle cookie banner icon
			UIkit.util.on('#cookie-banner', 'shown', function () {
				//$('#cookie-banner-icon').removeClass('uk-hidden');
			});

			UIkit.util.on('#cookie-banner', 'hidden', function () {
				//$('#cookie-banner-icon').addClass('uk-hidden');
			});

		},

		// Store cookie selection with callback
		clxCookieSelectionTrigger: function (pIdentifier,pOptIn='',pOptOut='') {

			var plugin = this.plugin;
			var pOpt;
			var data;

			cx.bind("cookieChanged", function(eventArgs) {
				if (eventArgs.cookie.identifier != pIdentifier) {
					return;
				}

				if (cx.privacy.cookies.isCookieActive(pIdentifier)) {

					// Cookie accepted
					pOpt = pOptIn;

					//console.log( 'Cookie Selection Opt-in: ' + pIdentifier + ' ' +  pOptIn );

				} else {

					// Cookie not accepted
					pOpt = pOptOut;

					//console.log( 'Cookie Selection Opt-out: ' + pIdentifier + ' ' + pOptOut );

				}

				data = {identifier: pIdentifier, opt: pOpt};

				// Fire a custom event listener
				$(window).trigger("customCookieSelectionListener", [data]);

			}, "privacy");


			return data;


		},

		// Fire opt-in / opt-out trigger
		clxCookieEventTrigger: function (pIdentifier,pOptIn='',pOptOut='') {

			var plugin = this.plugin;
			var pOpt;
			var data;

			cx.bind("cookieChanged", function(eventArgs) {
				if (eventArgs.cookie.identifier != pIdentifier) {
					return;
				}

				if (cx.privacy.cookies.isCookieActive(pIdentifier)) {

					// Cookie accepted :: fire the trigger
					dataLayer.push({'event' : pOptIn});
					pOpt = pOptIn;

					//console.log( 'Trigger Opt-in: ' + pIdentifier + ' ' +  pOptIn );

				} else {

					// Cookie not accepted :: fire the trigger
					dataLayer.push({'event' : pOptOut});

					pOpt = pOptOut;

					//console.log( 'Trigger Opt-out: ' + pIdentifier + ' ' + pOptOut );

				}

				data = {identifier: pIdentifier, opt: pOpt};

				// Fire a custom event listener
				$(window).trigger("customCookieEventListener", [data]);

			}, "privacy");


			return data;


		},


		// Fire opt-in / opt-out trigger
		clxCookieConsentModeTrigger: function (pIdentifier, pOptIn='',pOptOut='') {
			var plugin = this.plugin;
			var pOpt;
			var data;

			function gtag(){
				dataLayer.push(arguments);
			}

			gtag('consent', 'default', {
			  'ad_storage': 'denied',
			  'ad_user_data': 'denied',
			  'ad_personalization': 'denied',
			  'analytics_storage': 'denied'
			});

			cx.bind("cookieChanged", function(eventArgs) {
				if (eventArgs.cookie.identifier != pIdentifier) {
					return;
				}

				if (cx.privacy.cookies.isCookieActive(pIdentifier)) {
					// Cookie accepted :: fire the trigger
					gtag('consent', 'update', {
                      'ad_storage': 'granted',
                      'ad_user_data': 'granted',
                      'ad_personalization': 'granted',
                      'analytics_storage': 'granted'
                    });

					dataLayer.push({'event' : pOptIn});
					pOpt = pOptIn;

					//console.log( 'Trigger Opt-in: ' + pIdentifier + ' ' +  pOptIn );
				} else {
					// Cookie not accepted :: fire the trigger
					dataLayer.push('consent', 'update', {
                      'ad_storage': 'denied',
                      'ad_user_data': 'denied',
                      'ad_personalization': 'denied',
                      'analytics_storage': 'denied'
                    });

					dataLayer.push({'event' : pOptOut});
					pOpt = pOptOut;

					//console.log( 'Trigger Opt-out: ' + pIdentifier + ' ' + pOptOut );
				}

				data = {identifier: pIdentifier, opt: pOpt};

				// Fire a custom event listener
				$(window).trigger("customCookieConsentModeTrigger", [data]);

			}, "privacy");


			return data;
		},

		// Handle the color scheme cookie
		clxCookieColorScheme: function () {

			var soBase = $.soBaseScripts();

			let colorScheme 	= 'light';
			let identifier 		= 'cookie-color-scheme';
			let accepted		= false;

			cx.bind("cookieChanged", function(eventArgs) {
				if (eventArgs.cookie.identifier != identifier) {
					return;
				}

				if (cx.privacy.cookies.isCookieActive(identifier)) {

					// Cookie is accepted

					// Get color mode from document body
					if(typeof $('body').attr('data-color-scheme') == "undefined"){

						// No attribute set :: get color scheme from cookie
						colorScheme = soBase.getCookie(identifier);

						if(colorScheme == false) {
							// No document mode and no cookie set :: get user user agent settings
							if ( window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
								colorScheme = 'dark';
							} else {
								colorScheme = 'light';
							}
						}

					} else {
						colorScheme = $('body').attr('data-color-scheme');
					}

					// Set color scheme
					soBase.switchColorScheme(colorScheme, true);
					// accept cookies
					accepted = true;

				} else {

					// Cookie is not accepted

					// Get color mode from document body
					if(typeof $('body').attr('data-color-scheme') == "undefined"){

						// No attribute set :: get color scheme from cookie
						colorScheme = soBase.getCookie(identifier);

						if(colorScheme == false) {
							// No document mode and no cookie set :: get user user agent settings
							if ( window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
								colorScheme = 'dark';
							} else {
								colorScheme = 'light';
							}
						}

					} else {
						colorScheme = $('body').attr('data-color-scheme');
					}

					// Set color scheme
					soBase.switchColorScheme(colorScheme, false);

					// Clear the cookie if already set
					Cookies.remove(identifier);

				}


			}, "privacy");


			// Color scheme switcher
			$('.switch-color-scheme .switcher-button').on('click', function () {
				if($(this).attr('data-color-scheme') == 'dark') {
					soBase.switchColorScheme('dark', accepted);
				} else {
					soBase.switchColorScheme('light', accepted);
				}
			});


			return accepted;

		},

		// Checkbox Switcher
		switchCkbSwitcher: function () {

			$.each( $('.switcher-checkbox-container') , function(key,val) {

				// Hide all checkboxes
				$(val).children('.uk-checkbox').addClass('uk-hidden');

				// Check all checkbox switcher if on or off
				if( $(val).children('.uk-checkbox').prop('checked') == true ) {
					$(val).children('.switch-off').addClass('uk-active');
					$(val).children('.switch-on').removeClass('uk-active');
				} else {
					$(val).children('.switch-on').addClass('uk-active');
					$(val).children('.switch-off').removeClass('uk-active');
				}

				var attr = $(val).attr('data-so-switcher');

				if (typeof attr !== 'undefined' && attr !== false) {

					$( $(val).children('.uk-checkbox') ).on( "change", function() {

						// toggle the switcher button
						$(val).children('li').toggleClass('uk-active');

						// check and toggle posible related checkboxes
						$.each(  $('.switcher-checkbox-container').children('.uk-checkbox') , function(keySiblings,valSiblings) {

							if( $(valSiblings).prop('checked') == true ) {
								$(valSiblings).parent().children('.switch-off').addClass('uk-active');
								$(valSiblings).parent().children('.switch-on').removeClass('uk-active');
							} else {
								$(valSiblings).parent().children('.switch-on').addClass('uk-active');
								$(valSiblings).parent().children('.switch-off').removeClass('uk-active');
							}

						})
					});
				}
			});
		},


	} );


	//
	// Init Plugin
	//
	$[pluginName] = $.fn[pluginName] = function (settings) {
		return new stageonePlugin(this, settings);
	};

} )( jQuery, window, document );