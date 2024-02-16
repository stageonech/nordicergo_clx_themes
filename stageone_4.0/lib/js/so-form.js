/*****************************************************
*
*     Stageone Form Plugin
*
******************************************************/

// remap jQuery to $
( function( $, window, document, undefined ) {

	"use strict";

		//
		// Variables
		//

		var pluginName 	= "soForm",
			defaults 	= {};


		//
		// Plugin Constructor
		//

		function stageonePlugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this.defaults = defaults;
			this.name = pluginName;

			this.init();
		}

		$.extend( stageonePlugin.prototype, {
			init: function() {
				//console.log(this.element);
				//console.log(this.settings);
				//console.log(this._name);

				var msgDate = "Bitte geben Sie eine gültiges Datum ein. (dd/mm/yyyy)";
				var msgNumbers = "Bitte geben Sie nur Zahlen ein.";
				var msgDigits = "Bitte geben Sie nur Zahlen ein.";
				var msgPhone = "Bitte geben Sie eine gültige Telefonnummer ein.";


				// Init Validation
				this.element.each(function(){
					$(this).validate( {
						errorClass:"ipt-error",
						pendingClass:"ipt-pending",
						validClass:"ipt-valid",
						errorElement:"span",
						errorPlacement: function(error, element) {
							// Error container for input fields
							var errorContainer = element.parent().find('.error-container');

							// Error container for input groups
							if( !errorContainer.hasClass('error-container') ) {
								errorContainer = element.parent().parent().find('.error-container');
							}
							error.appendTo( errorContainer );
					  	},
						highlight: function(element, errorClass, validClass) {

							$(element).addClass(errorClass).removeClass(validClass);
							$(element).parent().addClass(errorClass).removeClass(validClass);

						},
						unhighlight: function(element, errorClass, validClass) {

							$(element).removeClass(errorClass).addClass(validClass);
							$(element).parent().removeClass(errorClass).addClass(validClass);

						},
						rules : {
							/* form_id: "required" */
						},
						messages : {
							/* form_id: "This is a custom message for the e-mail field" */
						}

					});
				});

				/*
				// Autofill E-Mail Form Field
				$("#contactFormFieldId_73").focus(function() {
					var firstname = $("#contactFormField_71").val();
					this.value = 'Test';
				});
				*/

				// Change Default Messages
				$.extend($.validator.messages, {
					required:"Dies ist ein Pflichtfeld.",
					remote:"Bitte diese Eingabe korrigieren.",
					email:"Bitte eine gültige E-Mail Adresse eingeben.",
					url:"Bitte eine gültige URL eingeben.",
					date:msgDate,
					dateISO:"Bitte ein gültiges ISO-Datum eingeben.",
					number:msgNumbers,
					digits:msgDigits,
					equalTo:"Bitte die gleichen Eingabe wiederholen.",
					maxlength:$.validator.format("Bitte nicht mehr als {0} Zeichen eingeben."),
					minlength:$.validator.format("Bitte mindestens {0} Zeichen eingeben."),
					rangelength:$.validator.format("Bitte eine Angabe zwischen {0} und {1} Zeichen eingeben."),
					range:$.validator.format("Bitte einen Wert zwischen {0} und {1} eingeben."),
					max:$.validator.format("Bitte einen Wert, welcher kleiner oder gleich gross {0} ist."),
					min:$.validator.format("Bitte einen Wert, welcher grösser oder gleich gross {0} ist."),
					step:$.validator.format("Bitte ein Vielfaches von {0} eingeben.")
				});

				// Validation Additional Rules
				if($('.rule_number').length > 0){
					$(".rule_number").each(function(){
						$(this).rules("add", { numeric: true });
					});
				}

				if($('.rule_phone').length > 0){
					$(".rule_phone").each(function(){
						$(this).rules("add", { isphone: true });
					});
				}

				if($('.rule_date').length > 0){
					$(".rule_date").each(function(){
						$(this).rules("add", { isdate: true });
					});
				}


				// Additional Functions
				$.validator.addMethod("numeric", function(value, element) {
					var regex=/^[0-9]+$/;
					return this.optional(element) || regex.test(value);
					},msgNumbers
				);

				$.validator.addMethod("isphone", function(value, element) {
					var regex=/^(?=.*[0-9])[- +()0-9]+$/;
					return this.optional(element) || regex.test(value);
					},msgPhone
				);

				$.validator.addMethod("isdate", function(value, element) {
					var regex=/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
					return this.optional(element) || regex.test(value);
					},msgDate
				);


			}

		} );

		// Init Plugin
		// ========================================================================
		$[pluginName] = $.fn[pluginName] = function (options) {
			return new stageonePlugin(this, options);
		};


} )( jQuery, window, document );


