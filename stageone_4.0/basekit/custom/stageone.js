/*****************************************************
 *
 *     Stageone Template Custom Script
 *
 ******************************************************/


// Remap jQuery to $
(function($) {


    /*****************************************************
     *
     *     Variables
     *
     ******************************************************/
    var log = false;
    var devMode = false;
    var googleApiKeyOld = 'UA-165038046-1';
    var googleAnalyticsID = 'G-LLS1TMT5CQ';

    /*****************************************************
     *
     *     Load Development Files
     *
     ******************************************************/

    if(devMode == true) {
        // Load Custom Less File without caching
        $('head').append('<link rel = "stylesheet/less" href = "/themes/stageone_4.0/basekit/custom/stageone.less?v=' + Date.now() + '" ></link>' );
        $('head').append('<script src = "/themes/stageone_4.0/lib/js/less.min.js" ></script>' );
        //$('head').append('<script src = "/themes/stageone_4.0/lib/js/less.min.js" data-env = "development" ></script>' );

        $('head').append('<script src = "/themes/stageone_4.0/lib/js/so-base-script.js"></script>' )
        $('head').append('<script src = "/themes/stageone_4.0/lib/js/so-livesearch.js"></script>' )
        $('head').append('<script src = "/themes/stageone_4.0/lib/js/so-form.js"></script>' )
        $('head').append('<script src = "/themes/stageone_4.0/lib/js/so-googlemaps.js"></script>' )
    }


    /*****************************************************
     *
     *     jQuery Functions
     *
     ******************************************************/


    //
    // Code before dom ready
    //

    $.fn.beforeDomReady = function() {
        // Empty
    }

    // Toggle a button
    $.fn.toggleBtn = function () {
        if($(this).hasClass('uk-active')) {
            $(this).removeClass('uk-active');
        } else {
            $(this).addClass('uk-active');
            $(this).parent().siblings().children().removeClass('uk-active');
        }
    }



    /*****************************************************
     *
     *     Init...
     *
     ******************************************************/

    //
    // Before DOM Ready
    //

    $(document).beforeDomReady();


    //
    // After DOM Ready
    //

    $(document).ready(function(){
        //
        // Cookie Plugin
        //
        if(typeof cx != "undefined") {
            if (typeof cx.privacy != "undefined") {

                // Init the plugin
                var soCookies = $.soCookies();

                /*
                //
                // Google Analytics
                //
                var identifier = 'google-analytics-4';
                var optIn = 'ga-opt-in';
                var optOut = 'ga-opt-out';

                var ga4 = soCookies.clxCookieSelectionTrigger(identifier, optIn, optOut);


                // Google Analytics by loading
                if (ga4.identifier == 'google-analytics-4' && ga4.opt == 'ga-opt-in') {
                    cookieFriendlyGALoading();
                }

                // Google Analytics by cookie banner event
                $(window).on("customCookieSelectionListener", function (event, pData) {
                    if (pData.identifier == 'google-analytics-4' && pData.opt == 'ga-opt-in') {
                        cookieFriendlyGALoading();
                    }
                });

                // Load GA4
                function cookieFriendlyGALoading() {
                    setTimeout(function() { // Avoid timing problems
                        var script = document.createElement('script');
                        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + googleAnalyticsID + '&callback=googleGAInit';
                        script.async = true;
                        document.head.appendChild(script);

                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', googleAnalyticsID);
                    }, 0);
                }
                */
            }
        }

        //
        // Init Stageone Custom Plugins
        //

        var frontendLang = $('body').attr('data-frontend-lang');
        if (frontendLang == undefined) {frontendLang = 'de';}

        // Base Scripts Plugin
        var soBase = $('body').soBaseScripts({
            mobileNavigation:$('#mobile-navigation'),
            mainNavigation:$('#main-navigation'),
            mobileNavigationMode:'hover',
            mainNavigationMode:'hover'
        });

        // Live Search
        var soLiveSearch = $('#live-search-input').soLivesearch({
            searchLocale:frontendLang,
            contentContainer:$('.live-search-container'),
            contentDropdown:$('.search-results-dropdown'),
            messageContainer:$('.livesearch-message'),
            searchButton:$( '#search-button' )

        });

        // Global Search Page
        var soGlobalSearch = $('#global-search-input').soLivesearch({
            searchLocale:frontendLang,
            contentContainer:$('#global-search-container'),
            messageContainer:$('#global-search-message')
        });


        // Mobile Live Search
        var soMobileLiveSearch = $('#mobile-live-search-input').soLivesearch({
            searchLocale:frontendLang,
            shortDescMaxLength:150,
            contentContainer:$('.mobile-live-search-container'),
            messageContainer:$('.mobile-livesearch-message'),
            searchButton:$( "#mobile-search-button" )
        });


        // Form Validation Plugin
        if($('.contactForm').length > 0) { var soForm = $('.contactForm').soForm(); }
        if($('.registrationForm').length > 0) { var soForm = $('.registrationForm').soForm(); }

        // Google Maps Plugin
        if ( $('#map-container-1').length > 0) {

            // Load Google Map
            $.getScript(
                "https://www.google.com/jsapi"
            ).done(function (script, textStatus) {
                    google.load('maps', '3', { other_params: 'sensor=true&key=' + googleApiKey,
                        callback: function googleMapsCallback() {
                            // Init Google Maps Plugin
                            var soGooglemaps = $('body').soGooglemaps({mapCenterLat:46.760523, mapCenterLng:7.617386, mapZoom:12});

                            if(log) {
                                if(!(typeof soGooglemaps === "undefined"))        {console.log(soGooglemaps[0].name, soGooglemaps[0].map)};
                                if(!(typeof soGooglemaps === "undefined"))        {console.log(soGooglemaps[1].name, soGooglemaps[1].map)};
                            }
                        }
                    });
                }
            ).fail(function (jqxhr, settings, ex) {
                console.warn('Could not load Google Map script: ' + jqxhr);
            });

        }

        //
        // Global Page Optimizations
        //

        // blur button focus
        $('.uk-button').on('click', function () {
            $(this).blur();
        });


        //
        // Page Custom Code
        //

        // Activate tab by url hash
        var activeTabByHash = soBase.getUrlParams('active-tab');

        if(activeTabByHash > 0) {

            activeTabByHash = activeTabByHash - 1;

            // set tab active state
            $('.switcher-tab').children('span').eq(activeTabByHash).addClass('uk-active');
            $('.switcher-tab').children('span').eq(activeTabByHash).siblings().removeClass('uk-active');

            // open active tab
            $('.uk-switcher').children('li').eq(activeTabByHash).addClass('uk-active');
            $('.uk-switcher').children('li').eq(activeTabByHash).siblings().removeClass('uk-active');

        }


        // Toggle the main menu button
        $('.animated-mobile-menu').on('click', function() {
            $(this).toggleBtn();
        })

        // Shuffle the eyecatcher slider
        var arrSlideItems = [];
        $('.shuffle-slideshow > .uk-slideshow-items').children('li').each( function() {
            arrSlideItems.push($(this));
        });

        arrSlideItems = soBase.shuffleArray(arrSlideItems);
        $('.shuffle-slideshow > .uk-slideshow-items').html(arrSlideItems);


        // Use a custom scroll down label text
        if( $('body').attr('data-css-name') != '') {
            $('#scroll-down-button').find('.scroll-bottom-label').html( $('body').attr('data-css-name') );
        }


        // Style contact form fieldset

        // static by field id
        //var fieldset1 = $('#fieldset-01');
        //var content1 = fieldset1.html();
        //fieldset1.html('<div id="first-fieldset" class="uk-grid uk-grid-small uk-child-width-1-1 uk-child-width-1-3@m" data-uk-grid>' + content1 + '</div>');

        // dynamical by fieldset name
        /*
        var counter = 1;
        $('.contact-form').each( function () {
            var form = $(this);

            form.find('fieldset').each( function () {
                var fieldset = $(this);
                var fieldsetClass = fieldset.find('legend').html();

                var content = fieldset.html();
                fieldset.html('<div id="fieldset-'+ counter +'" class="uk-grid uk-grid-small uk-child-width-1-1 ' + fieldsetClass + '" data-uk-grid>' + content + '</div>');

                counter++;
            })

        })

         */


        //$( $('#second-fieldset').children('.contact-row').get(1) ).addClass('uk-width-1-2@s uk-width-1-4@l');
        //$( $('#second-fieldset').children('.contact-row').get(2) ).addClass('uk-width-1-2@s uk-width-1-4@l');

        // label focus state
        $( "input" ).focus(function() {
            $(this).parent().parent().addClass('has-focus');
        });

        $( "input" ).blur(function() {
            $(this).parent().parent().removeClass('has-focus');
        });

        $( "textarea" ).focus(function() {
            $(this).parent().parent().addClass('has-focus');
        });

        $( "textarea" ).blur(function() {
            $(this).parent().parent().removeClass('has-focus');
        });

        // Hide scroll down button if there is no content
        if($('#second-content').children().length == 0) {
            $('#mobile-scroll-down-button').remove();
            $('#scroll-down-button').remove();
        }


        // Scroll functions
        $(window).bind('scroll', function () {

            if (soBase.getScrollDir().top > 30) {
                $('#scroll-down-button').addClass('is-hidden');
                $('#mobile-scroll-down-button').addClass('is-hidden');
            } else {
                $('#scroll-down-button').removeClass('is-hidden');
                $('#mobile-scroll-down-button').removeClass('is-hidden');
            }

            if (soBase.getScrollDir().top > 250) {
                $('#mobile-content-menu-button').removeClass('is-hidden');
            } else {
                $('#mobile-content-menu-button').addClass('is-hidden');
            }

            if (soBase.getScrollDir().top > 400) {
                $('#scroll-up-button').addClass('is-visible');
            } else {
                $('#scroll-up-button').removeClass('is-visible');
            }

        });

        //
        // Log Functions
        //
        if(log) {
            if(!(typeof soBase === "undefined"))        {console.log(soBase.name, soBase.useragents, soBase.mediaqueries.views)};
            if(!(typeof soLiveSearch === "undefined"))  {console.log(soLiveSearch.name)};
            console.log('Dom Ready...');
        }

    });

    //
    // Page Loaded Function
    //
    $(window).on('load', function () {

        //
        // Log Functions
        //
        if(log) { console.log('Page Loaded...'); }

    });

    //
    // Window Resize Function
    //
    $(window).resize(function() {

        //
        // Log Functions
        //
        if(log) {console.log('Page Resize...');}

    })


})(jQuery);


