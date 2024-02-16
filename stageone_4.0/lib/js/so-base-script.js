/*****************************************************
*
*     Stageone Main Script Plugin
*
******************************************************/

// remap jQuery to $
( function( $, window, document, undefined ) {

	"use strict";


		//
		// Variables
        //

		var pluginName 		= "soBaseScripts",
			defaults 		= {mobileNavigationMode:'hover', mobileNavigationActiveOpen:true, mainNavigationMode:'hover', mobileNavLevel1:'.level-1', mobileNavLevel2:'.level-2', mobileNavSwitcher:'.switcher-icon', mainNavLevel1:'.level-1', mainNavLevel2:'.level-2'},
			userAgents 		= {},
			mediaQueries	= {
				breakpoints: {
					small:640,
					medium:960,
					large:1100,
					xlarge:1600,
				},
				mediaqueries: {
					xsmall: '',
					small:'',
					medium:'',
					large:'',
					xlarge:'',
					landscape:'',
					portrait:''
				},
				views: {
					xsmall:false,
					small:false,
					medium:false,
					large:false,
					xlarge: false,
					landscape: false,
					portrait: false
				}
			}

		//
		// Plugin Constructor
		//
		function stageonePlugin ( element, settings ) {

			this.plugin			= this;
			this.element 		= element;
			this.settings 		= $.extend( {}, defaults, settings );
			this.defaults 		= defaults;
			this.name 			= pluginName;
			this.useragents 	= userAgents;
			this.mediaqueries	= mediaQueries;

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

				// Cloudrexx optimizations
				this.cloudrexxOptimizations();

				// Handle Useragents
				this.handleUseragents();

				// Handle Mediaqueries
				this.handleMediaqueries();

				// Init Navigation Control
				this.navigationControl();

			},

			//
			// Cloudrexx
			//

			cloudrexxOptimizations : function() {

				var plugin = this.plugin;

				//
				// Forms
				//
				$.each( $('fieldset') ,function() {
					$(this).addClass('uk-fieldset');
				})

				$.each( $('legend') ,function() {
					$(this).addClass('uk-legend');
				})

				// Valid Dateformat with Datepicker
				// > activate only if cx variable is defined
				// > change class date with datepickerdate in FieldDate.html
				/*
				cx.ready(function() {
					cx.jQuery('.datepickerdate').datepicker({ dateFormat: 'dd/mm/yy' });
				});
				*/

				// Captcha Styling
				// add uikit classes
				$('#captcha > .row input').addClass('uk-input');


				//
				// Cloudrexx Calendar Module
				//

				// make registration link a button
				$('.calendar-registration-container').children('a').addClass('uk-button uk-button-secondary');

				// add registration form fields
				$('#registrationForm fieldset > div').first().hide();

				$('#registrationForm .row').each( function() {
					$(this).addClass('uk-margin-small');
				});

				$('#registrationForm label').each( function() {
					$(this).addClass('uk-form-label');
				});

				$('#registrationForm select').each( function() {
					$(this).addClass('uk-select');
				});

				$('#registrationForm input[type="text"]').each( function() {
					$(this).addClass('uk-input');
				});

				$('#registrationForm input[type="checkbox"]').each( function() {
					$(this).addClass('uk-checkbox');
				});

				$('#registrationForm input[type="radio"]').each( function() {
					$(this).addClass('uk-radio');
				});

				$('#registrationForm textarea').each( function() {
					$(this).addClass('uk-textarea');
				});

				$('#registrationForm input[type="submit"]').each( function() {
					$(this).addClass('uk-button uk-button-primary');
					$(this).parent().addClass('uk-flex uk-flex-right');
				});

			},


			//
			// User Agent
			//

			handleUseragents: function() {

				var isChrome        = navigator.userAgent.indexOf('Chrome') > -1;
				var isExplorer      = navigator.userAgent.indexOf('MSIE') > -1;
				var isExplorer11    = navigator.userAgent.indexOf('rv:11.0') > -1;
				var isEdge          = navigator.userAgent.indexOf("Edge") > -1
				var isFirefox       = navigator.userAgent.indexOf('Firefox') > -1;
				var isSafari        = navigator.userAgent.indexOf("Safari") > -1;
				var isOpera         = navigator.userAgent.toLowerCase().indexOf("op") > -1;
				var isIOS           = navigator.userAgent.indexOf("iPhone") > -1 || navigator.userAgent.indexOf("iPod") > -1 || navigator.userAgent.indexOf("iPad") > -1;
				var isAndroid       = navigator.userAgent.indexOf("Android") > -1;
				var isIOSFirefox    = isIOS && navigator.userAgent.indexOf("FxiOS") > -1;
				var isIOSChrome     = isIOS && navigator.userAgent.indexOf("CriOS") > -1;
				var isIOSSafari     = isIOS && navigator.userAgent.indexOf("Safari") > -1;

				if ((isChrome)&&(isSafari)) {isSafari=false;}
				if ((isChrome)&&(isOpera)) {isChrome=false;}

				if ((isIOSFirefox)||(isIOSChrome)) {isSafari=false;isIOSSafari=false;}

				var isTouchDevice = false;
				var isNoTouchDevice = true;
				if( isIOS == true || isAndroid == true || (navigator.userAgent.match(/iemobile/i)) ) { isTouchDevice = true; isNoTouchDevice = false; }

				this.useragents = {
					chrome:isChrome,
					explorer:isExplorer,
					explorer11:isExplorer11,
					edge:isEdge,
					firefox:isFirefox,
					safari:isSafari,
					opera:isOpera,
					ios:isIOS,
					android:isAndroid,
					iosfirefox:isIOSFirefox,
					ioschrome:isIOSChrome,
					iossafari:isIOSSafari,
					isTouchDevice:isTouchDevice,
					isNoTouchDevice:isNoTouchDevice
				}

				// run useragent set script
				var plugin = this.plugin;
				$.each(plugin.useragents, function(agent, value) {
					if(value) {
						var handler = agent;
						plugin[handler]();
					}
				})

			},

			chrome: function() {
				$('body').addClass('is-chrome');
			},

			edge: function() {
				$('body').addClass('is-edge');

				// avoid ms edge to format telephone numbers
				$('body').attr("x-ms-format-detection", "none");
			},

			explorer: function() {
				$('body').addClass('is-explorer');

				// avoid ms edge to format telephone numbers
				$('body').attr("x-ms-format-detection", "none");
			},

			explorer11: function() {
				$('body').addClass('is-explorer-11');

				// avoid ms edge to format telephone numbers
				$('body').attr("x-ms-format-detection", "none");
			},

			firefox: function() {
				$('body').addClass('is-firefox');
			},

			safari: function() {
				$('body').addClass('is-safari');
			},

			opera: function() {
				$('body').addClass('is-opera');
			},

			android: function() {
				$('body').addClass('is-android');
			},

			ios: function() {
				$('body').addClass('is-ios');
			},

			iosfirefox: function() {
				$('body').addClass('is-ios-firefox');
			},

			ioschrome: function() {
				$('body').addClass('is-ios-chrome');
			},

			iossafari: function() {
				$('body').addClass('is-ios-safari');
			},

			isTouchDevice: function() {
				$('body').addClass('is-touch-device');
			},

			isNoTouchDevice: function() {
				$('body').addClass('is-no-touch-device');
			},

			//
			// Mediaqueries
			//

			handleMediaqueries: function() {

				var plugin = this.plugin;

				// Set mediaqueries
				this.mediaqueries.mediaqueries.xsmall = window.matchMedia("(max-width: " + this.mediaqueries.breakpoints.small + "px)");
				this.mediaqueries.mediaqueries.small = window.matchMedia("(min-width: " + (this.mediaqueries.breakpoints.small + 1) + "px) and (max-width: " + this.mediaqueries.breakpoints.medium + "px)");
				this.mediaqueries.mediaqueries.medium = window.matchMedia("(min-width: " + (this.mediaqueries.breakpoints.medium + 1) + "px) and (max-width: " + this.mediaqueries.breakpoints.large + "px)");
				this.mediaqueries.mediaqueries.large = window.matchMedia("(min-width: " + (this.mediaqueries.breakpoints.large + 1) + "px) and (max-width: " + this.mediaqueries.breakpoints.xlarge + "px)");
				this.mediaqueries.mediaqueries.xlarge = window.matchMedia("(min-width: " + this.mediaqueries.breakpoints.xlarge + "px)");
				this.mediaqueries.mediaqueries.landscape = window.matchMedia("(orientation:landscape)");
				this.mediaqueries.mediaqueries.portrait = window.matchMedia("(orientation:portrait)");

				// Set Mediaqueries function on load
				if(this.mediaqueries.mediaqueries.xsmall.matches)     { this.mediaqueries.views.xsmall 		= this.xSmallScreen(); }
				if(this.mediaqueries.mediaqueries.small.matches)      { this.mediaqueries.views.small 		= this.smallScreen(); }
				if(this.mediaqueries.mediaqueries.medium.matches)     { this.mediaqueries.views.medium 		= this.mediumScreen(); }
				if(this.mediaqueries.mediaqueries.large.matches)      { this.mediaqueries.views.large		= this.largeScreen(); }
				if(this.mediaqueries.mediaqueries.xlarge.matches)     { this.mediaqueries.views.xlarge 		= this.xlargeScreen(); }
				if(this.mediaqueries.mediaqueries.landscape.matches)  { this.mediaqueries.views.landscape 	= this.landscapeScreen(); }
				if(this.mediaqueries.mediaqueries.portrait.matches)   { this.mediaqueries.views.portrait 	= this.portraitScreen(); }

				// Set Mediaqueries function on resize
				plugin.mediaqueries.mediaqueries.xsmall.addListener( function() { if (plugin.mediaqueries.mediaqueries.xsmall.matches) 			{ plugin.xSmallScreen(); }});
				plugin.mediaqueries.mediaqueries.small.addListener( function() { if (plugin.mediaqueries.mediaqueries.small.matches)          	{ plugin.smallScreen(); } });
				plugin.mediaqueries.mediaqueries.medium.addListener( function() { if (plugin.mediaqueries.mediaqueries.medium.matches)        	{ plugin.mediumScreen();  } });
				plugin.mediaqueries.mediaqueries.large.addListener( function() { if (plugin.mediaqueries.mediaqueries.large.matches)          	{ plugin.largeScreen(); } });
				plugin.mediaqueries.mediaqueries.xlarge.addListener( function() { if (plugin.mediaqueries.mediaqueries.xlarge.matches)        	{ plugin.xlargeScreen(); } });
				plugin.mediaqueries.mediaqueries.landscape.addListener( function() { if (plugin.mediaqueries.mediaqueries.landscape.matches)  	{ plugin.landscapeScreen(); } });
				plugin.mediaqueries.mediaqueries.portrait.addListener( function() { if (plugin.mediaqueries.mediaqueries.portrait.matches)    	{ plugin.portraitScreen(); } });

			},

			xSmallScreen: function() {
				return true;
			},

			smallScreen: function( ) {
				return true;
			},

			mediumScreen: function() {
				return true;
			},

			largeScreen: function() {
				return true;
			},

			xlargeScreen: function() {
				return true;
			},

			landscapeScreen: function() {
				return true;
			},

			portraitScreen: function() {
				return true;
			},

			//
			// Misc
			//

			// Use Click Navigation :: First level Page is inactive
			navigationControl: function() {

				var plugin = this.plugin;

				// Mobile Navigation

				// Mobile Navigation Accordion
				var level_1 = plugin.settings.mobileNavLevel1;
				var liLev1 = 'li' + level_1;
				var aLev1 = 'a' + level_1;

				// Remove Accordion For Navitems Without Children
				plugin.settings.mobileNavigation.find(liLev1).each(function() {
					if( $(this).find('.uk-accordion-content').length == 0) {
						$(this).find(plugin.settings.mobileNavSwitcher).remove();
					} else {

						if(plugin.settings.mobileNavigationMode == 'click') {
							var toggleContainer = $(this).find('.toggle-container');
							toggleContainer.addClass('accordion-toggle');
							toggleContainer.find('a').removeClass('accordion-toggle');
						}
					}

					// Open Mobile Accordion If A Subitem Is Active
					if(plugin.settings.mobileNavigationActiveOpen == true) {

						// Open Active Submenu Items
						if( $(this).hasClass('starter_active') ) {
							$(this).addClass('uk-open');

							$(this).find('.uk-accordion-content').attr('aria-hidden', false);
							$(this).find('.uk-accordion-content').attr('hidden', false);

						}

					}


				})


				// Mobile Navigation Click Mode
				if(plugin.settings.mobileNavigationMode == 'click') {

					plugin.settings.mobileNavigation.find(liLev1).each( function() {

						var lev1a = $(this).find(aLev1);
						var strLev2 = plugin.settings.mobileNavLevel2.toString();

						if( $(this).find(strLev2).length > 0 ) {
							// prevent event
							lev1a.click(function(event) {
								event.preventDefault();
							});

							lev1a.attr('href','#');
						};
					})
				}

				// Main Navigation
				if(plugin.settings.mainNavigationMode == 'click') {

					var level_1 = plugin.settings.mainNavLevel1;
					var liLev1 = 'li' + level_1;
					var aLev1 = 'a' + level_1;

					plugin.settings.mainNavigation.find(liLev1).each( function() {

						var lev1a = $(this).find(aLev1);
						var strLev2 = plugin.settings.mainNavLevel2.toString();

						if( $(this).find(strLev2).length > 0 ) {

							// prevent event
							lev1a.click(function(event) {
								event.preventDefault();
							});

							lev1a.attr('href','#');
						};
					})
				}
			},


			// Shuffle Array
			shuffleArray: function (array) {
				var currentIndex = array.length, temporaryValue, randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}

				return array;
			},

			// Get URL Parameters
			getUrlParams: function(sParam) {

				var sPageURL = window.location.search.substring(1),
					sURLVariables = sPageURL.split('&'),
					sParameterName,
					i;

				for (i = 0; i < sURLVariables.length; i++) {
					sParameterName = sURLVariables[i].split('=');

					if (sParameterName[0] === sParam) {
						return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
					}
				}

			},

			// Get URL Parameters
			getUrl: function() {

				var pageURL = window.location;
				return pageURL;

			},

			// Check URL
			setActiveState: function(pEl, pActiveClass='uk-active') {

				var element = pEl;
				var pagePath = this.getUrl().pathname.toString().toLocaleLowerCase();
				var strToCheck = pEl.attr('title').toString().toLocaleLowerCase();

				if (pagePath.indexOf(strToCheck) > 0) {
					element.addClass(pActiveClass)
				}

				return strToCheck;

			},

			// Get scroll direction
			getScrollDir: function() {

				var b = document.body;
				var e = document.documentElement;

				return {
					left: parseFloat(window.pageXOffset || b.scrollLeft || e.scrollLeft),
					top: parseFloat(window.pageYOffset || b.scrollTop || e.scrollTop)
				}
			}


		} );


		//
		// Init Plugin
		//
		$[pluginName] = $.fn[pluginName] = function (settings) {
			return new stageonePlugin(this, settings);
		};

} )( jQuery, window, document );