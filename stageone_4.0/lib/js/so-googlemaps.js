/*****************************************************
*
*     Stageone Google Maps Plugin
*
******************************************************/

// remap jQuery to $
( function( $, window, document, undefined ) {

	"use strict";
		// Variables
        // ========================================================================


		// Defaults
		// ========================================================================
		var pluginName = "soGooglemaps",
			defaults = {
		        mapCenterLat:46.759953,
                mapCenterLng: 7.626279,
                mapZoom: 16

            },
            defaultPointer = {
                path: '/themes/stageone_3.0/assets/images/',
                pointer :'map-pointer',
                filetype :'.svg'
            },
            defaultStyle = {
                mapStyles: [{
                    style: [{
                        "featureType": "landscape",
                        "elementType": "labels",
                        "stylers": [{"visibility": "off"}]
                    }, {"featureType": "transit", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [{"visibility": "off"}]
                    }, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [{"visibility": "off"}]
                    }, {"stylers": [{"hue": "#00aaff"}, {"saturation": -100}, {"gamma": 1.5}, {"lightness": 12}]}, {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [{"visibility": "on"}, {"lightness": 0}]
                    }, {"featureType": "road", "elementType": "geometry", "stylers": [{"lightness": 10}]}]
                },
                    {
                        style: [/*empty*/]
                    }]
            },
            defaultMap = {
                mapID: 'map-1',
                mapName: 'Standort',
                mapContainer: 'map-container-1',
                mapZoom: 10,
                mapLatLngCenter: {lat: 47.097873, lng: 7.553625},
                UIDisabled: false,
                mapLocations: [{
                        lat: 46.7552252,
                        lng: 7.6284679,
                        pointer: defaultPointer.pointer,
                        window: '<div class="windowinfo"><div class="grid-row"><strong>Location One</strong></div></div>',
                        owlHash: 'pos_1'
                    }]
            };

		// Plugin Constructor
		// ========================================================================
		function stageonePlugin ( pElement, pOptions, pPointer, pStyle, pMap ) {
			this.element = pElement;

            this.settings = $.extend( {}, defaults, pOptions );
			this._defaults = defaults;

            this.mapPointer = $.extend( {}, defaultPointer, pPointer );
			this._defaultPointer = defaultPointer;

            this.mapStyle = $.extend( {}, defaultStyle, pStyle );
			this._defaultStyle = defaultStyle;

			// set the map center and map pointer of the custom location
			defaultMap.mapLatLngCenter.lat = this.settings.mapCenterLat;
			defaultMap.mapLatLngCenter.lng = this.settings.mapCenterLng;

			defaultMap.mapLocations[0].lat = this.settings.mapCenterLat;
			defaultMap.mapLocations[0].lng = this.settings.mapCenterLng;

			defaultMap.mapZoom = this.settings.mapZoom;

            this.map = $.extend( {}, defaultMap, pMap );
			this._defaultMap = defaultMap;

            this.name = pluginName;

			this.init(this.element);
		}

		$.extend( stageonePlugin.prototype, {
			init: function(element) {

			    // Create maps option based
			    this.createMap(this.map.mapID, this.map.mapContainer);

				//console.log(this.element);
				//console.log(this.settings);
				//console.log(this._name);

			},

            createMap: function(pMapID, pMapContainer) {

			    var id, style, gMap, marker, infowindow, i, x;

                // Build map
                id       = this.map.mapID;
                style    = new google.maps.StyledMapType(this.mapStyle.mapStyles[0].style, {name: this.map.mapName});
                gMap     = new google.maps.Map(document.getElementById(pMapContainer), {
                                        zoom: this.map.mapZoom,
                                        center: this.map.mapLatLngCenter,
                                        disableDefaultUI: this.map.UIDisabled,
                                        mapTypeControl: true,
                                        mapTypeControlOptions: {
                                            mapTypeIds: [id,google.maps.MapTypeId.ROADMAP],
                                            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                                            position: google.maps.ControlPosition.LEFT_TOP
                                        },

                                        streetViewControl: true,
                                        streetViewControlOptions: {
                                            position: google.maps.ControlPosition.RIGHT_BOTTOM
                                        },

                                        fullscreenControl: true,
                                        fullscreenControlOptions: {
                                            position: google.maps.ControlPosition.RIGHT_BOTTOM
                                        }

                                });

                // Set map style
                gMap.mapTypes.set(id, style);
                gMap.setMapTypeId(id);

                // Build info windows
                infowindow  = new google.maps.InfoWindow();
                google.maps.event.addListener(infowindow, 'domready', function() {
                    $('.gm-style-iw').prev().addClass('gm-style-iw-wrapper');
                    $('.gm-style-iw').next().addClass('gm-style-iw-close-icon');
                });

                // Build a custom html marker
                function CustomMarker(latlng, map, args) {
                    this.latlng = latlng;
                    this.args = args;
                    this.setMap(gMap);
                }

                CustomMarker.prototype = new google.maps.OverlayView();

                CustomMarker.prototype.draw = function() {

                    var self = this;
                    var div = this.div;

                    if (!div) {

                        div = this.div = document.createElement('div');

                        div.className = 'dot-animation-marker';
                        div.style.position = 'absolute';
                        div.style.cursor = 'pointer';
                        div.style.width = '1px';
                        div.style.height = '1px';
                        div.insertAdjacentHTML('beforeend', '<div id="dot-animation"><span class="ringTwo"></span><span class="ringOne"></span><span class="dot"></span></div>');

                        if (typeof(self.args.marker_id) !== 'undefined') {
                            div.dataset.marker_id = self.args.marker_id;
                        }

                        google.maps.event.addDomListener(div, "click", function(event) {
                            window.open('https://goo.gl/maps/WEFpLKo2Mky', '_blank');
                            google.maps.event.trigger(self, "click");
                        });

                        var panes = this.getPanes();
                        panes.overlayImage.appendChild(div);
                    }

                    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

                    if (point) {
                        div.style.left = (point.x - 10) + 'px';
                        div.style.top = (point.y - 20) + 'px';
                    }
                };

                CustomMarker.prototype.remove = function() {
                    if (this.div) {
                        this.div.parentNode.removeChild(this.div);
                        this.div = null;
                    }
                };

                CustomMarker.prototype.getPosition = function() {
                    return this.latlng;
                };
                // end of custom html marker

                // Build markers
                for (x = 0; x < this.map.mapLocations.length; x++) {

                    /*
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(this.map.mapLocations[x].lat, this.map.mapLocations[x].lng),
                        map: gMap,
                        icon: this.mapPointer.path + this.map.mapLocations[x].pointer + this.mapPointer.filetype
                    });
                    */

                    // Add marker click events
                    /*
                    google.maps.event.addListener(marker, 'click', (function(marker, i, x, pMap) {
                        return function() {
                            infowindow.setContent(pMap.mapLocations[x].window);
                            infowindow.open(gMap, marker);
                            // switch owl slider location
                            //window.location.hash = mapOptions.mapLocations[x].owlHash;
                        }
                    })(marker, i, x, this.map));
                    */

                    // build custom html marker
                    var myLatlng = new google.maps.LatLng(this.settings.mapCenterLat, this.settings.mapCenterLng);

                    var overlay = new CustomMarker(
                        myLatlng,
                        gMap,
                        {
                            marker_id: '123'
                        }
                    );

                }
			}

		} );


		// Init Plugin
		// ========================================================================
		$[pluginName] = $.fn[pluginName] = function (options) {

		    var arrMaps = [];
		    // Create maps
            var map_1 = new stageonePlugin(this, options);
            //var map_2 = new stageonePlugin(this, null, null, null, {mapID : 'map-2', mapName : 'Standort 2', mapContainer:'map-container-2'});

            arrMaps.push(map_1);
            //arrMaps.push(map_2);

            return arrMaps;

		};

} )( jQuery, window, document );
