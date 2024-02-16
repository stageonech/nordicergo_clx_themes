/*****************************************************
 *
 *     Stageone Live Search Plugin
 *
 ******************************************************/

// remap jQuery to $
( function( $, window, document, undefined ) {

    "use strict";


    //
    // Variables
    //

    var pluginName 		= "soLivesearch",
        defaults 		= {searchLocale:'de', searchNodeId:false, shortDescMaxLength:500, contentContainer:false, contentDropdown:false, messageContainer:false, clearOnClick:true, searchButton:false, preventFormSubmit:true};

    //
    // Plugin Constructor
    //
    function stageonePlugin ( inputfield, settings ) {

        this.plugin			= this;
        this.inputfield 	= inputfield;
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

            //console.log(this.inputfield);
            //console.log(this.settings);
            //console.log(this.name);

            var plugin = this.plugin;
            var inputfield = this.inputfield;

            // Init Livesearch
            this.liveSearch();

            // Set Focus by clicking the search button
            if(plugin.settings.searchButton != false ) {
                plugin.settings.searchButton.click(function() {
                    inputfield.focus();
                });
            }

            // Prevent Form Submit
            if(plugin.settings.preventFormSubmit == true) {
                inputfield.parent().submit(function(e){
                    e.preventDefault();
                });
            }

        },

        //
        // Ajax Live Search
        //

        // Get Search Results
        liveSearch: function() {

            var plugin = this.plugin;

            // hide search status message if content is not in a dropdown
            if(plugin.settings.contentDropdown == false) {
                plugin.hideIt();
            }

            this.inputfield.on('keyup', function(event) {

                var url = '/api/Search';
                var data = {
                    term: $(this).val(),
                    locale: plugin.settings.searchLocale,
                    nodeId: plugin.settings.searchNodeId
                }

                if($(this).val().length > 2) {

                    $.getJSON(
                        url,
                        data,
                        function (data, textStatus, jqXHR) {

                            plugin.settings.contentContainer.html('');
                            $.each(data, function (key, val) {
                                // add search results
                                var shortContent = $.trim(val.Content).substring(0, plugin.settings.shortDescMaxLength);

                                // show download custom search result
                                if(val.Component == 'Downloads') {

                                    // add download search result

                                    plugin.settings.contentContainer.append('' +
                                        '<li data-target="search-content-' + val.Component + '" class="livesearch-item search-content-all search-content-' + val.Component + '  uk-margin-remove-top ">' +
                                        '	<div><a href="' + val.Link + '" class="uk-link-reset uk-padding-small uk-padding-remove-horizontal uk-flex uk-flex-between uk-flex-middle ">' +
                                        '		<div class="list-item"><span data-uk-icon="icon:thin-063_paper_document_file_word;ratio:0.4;" class="uk-icon"></span> ' + val.Title + '</div>' +
                                        '		<div style="width:55px;" class="uk-text-right"><span data-uk-icon="icon:600-icons-577;ratio:1;" class="uk-icon"></span></div>' +
                                        '	</a></div>' +
                                        '	<hr class="uk-margin-remove" />' +
                                        '</li>');

                                } else {

                                    // add other search results

                                    plugin.settings.contentContainer.append('' +
                                        '<li data-target="search-content-' + val.Component + '" class="livesearch-item search-content-all search-content-' + val.Component + ' ">' +
                                        '	<div><a href="' + val.Link + '" class="uk-link-reset uk-padding-small uk-padding-remove-horizontal">' +
                                        '		<span class="uk-display-block">' + val.Title + '</span>' +
                                        '		<span class="uk-display-block uk-text-small uk-margin-small-bottom">' + shortContent + '</span>' +
                                        '	</a></div>' +
                                        '	<hr class="uk-margin-remove" />' +
                                        '</li>');

                                }



                            });

                            // Update Search Message
                            $(plugin.settings.messageContainer).find( $('.current-search-term') ).html(data.term);

                            plugin.searchMessage();

                            if(plugin.settings.contentDropdown == false) {

                            } else {
                                UIkit.dropdown( plugin.settings.contentDropdown ).show();
                            }

                        }
                    );

                } else {

                    if(plugin.settings.contentDropdown == false) {

                        // hide no results message
                        plugin.hideIt();

                        // reset the search content
                        plugin.settings.contentContainer.html('');

                    } else {
                        UIkit.dropdown(plugin.settings.contentDropdown).hide();
                        UIkit.util.on(plugin.settings.contentDropdown, 'hide', function () {
                            //$('#page-overlay').removeClass('is-visible');
                        });
                    }

                }
            });

            // Clear Search Field On Click
            this.inputfield.on('click', function () {

                if(plugin.settings.clearOnClick) {
                    $(this).val('');
                    $(plugin.settings.contentContainer).children('.livesearch-item').remove();

                    if(plugin.settings.contentDropdown == false) {
                        plugin.hideIt()
                    } else {
                        UIkit.dropdown(plugin.settings.contentDropdown).hide();
                        UIkit.util.on(plugin.settings.contentDropdown, 'hide', function () {
                            //$('#page-overlay').removeClass('is-visible');
                        });
                    }
                }

            });


        },

        // Handle Search Messages
        searchMessage:function() {

            var plugin = this.plugin;
            var noData = true;

            if( $(plugin.settings.contentContainer).children('.livesearch-item').length > 0 ) { noData = false;}

            if(noData == true) {
                //$(plugin.settings.messageContainer).hide();
                plugin.showIt();
            } else {
                //$(plugin.settings.messageContainer).show();
                plugin.hideIt();
            }

        },

        hideIt: function() {
            var plugin = this.plugin;
            plugin.settings.messageContainer.hide();
        },

        showIt: function() {
            var plugin = this.plugin;
            plugin.settings.messageContainer.show();
        }



    } );


    //
    // Init Plugin
    //
    $[pluginName] = $.fn[pluginName] = function (settings) {
        return new stageonePlugin(this, settings);
    };

} )( jQuery, window, document );