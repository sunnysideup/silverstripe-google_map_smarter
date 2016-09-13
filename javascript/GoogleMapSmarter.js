/**
 * options:
 *  - id
 *  - iconURL
 *  - iconHeight
 *  - iconWidth
 *  - iconIsRetinaSize
 *  - defaultZoom
 *  - defaultLocation
 *    - lat
 *    - lng
 *  - points:[
 *      - title: ...
 *      - address: ...
 *      - lat: ...
 *      - lng: ....
 *      - id: .....
 *    ]
 *  - markerCallbackFX: function() { ... }
 *
 *
 *
 *
 */


function GoogleMapSmarter (mapOptions) {


    var MyMap = {

        map: null,

        boundsManager: null,

        geocoder: null,

        mapOptions: {
            id: "google-map",
            iconIsRetinaSize:  1,
            iconURL:  "myimage.png",
            iconWidth:  20,
            iconHeight: 32,
            defaultZoom: 7,
            defaultLocation: {lat: 0, lng: 0},
            points: [
            ],
            markerCallbackFX: null
        },

        init: function(mapOptions) {
            this.mapOptions =  jQuery.extend(this.mapOptions, mapOptions);

            MyMap.map = new google.maps.Map(
                document.getElementById(this.mapOptions.id),
                {
                    center: {lat: MyMap.mapOptions.defaultLocation.lat, lng: MyMap.mapOptions.defaultLocation.lng},
                    zoom: MyMap.defaultZoom,
                    options: {styles: MyMap.mapStyling}
                }
            );
            MyMap.boundsManager = new google.maps.LatLngBounds();

            var markerNumber;
            var points = this.mapOptions.points;
            for (markerNumber = 0; markerNumber < points.length; markerNumber++) {
                point = points[markerNumber];
                if(
                    typeof point.lng !== 'undefined' && point.lng !== 0 &&
                    typeof point.lat !== 'undefined' && point.lat !== 0
                ) {
                    MyMap.addMarkerToMap(
                        point.id,
                        point.title,
                        point.address,
                        point.lat,
                        point.lng,
                        markerNumber
                    );
                } else if(typeof point.address !== 'undefined') {
                    MyMap.addViaAddress(
                        point.id,
                        point.title,
                        point.address,
                        markerNumber
                    );
                } else {
                    console.debug('ERROR: no address NOR lat/lng specified.');
                }
            }
        },


        addMarkerToMap: function(id, title, address, lat, lng, markerNumber){

            var infowindow = new google.maps.InfoWindow();
            var iconConfig = {
                url: MyMap.mapOptions.iconURL,

                size: new google.maps.Size(
                    mapOptions.iconWidth,
                    mapOptions.iconHeight
                ),
                anchor: new google.maps.Point(
                    Math.round(mapOptions.iconWidth / (2)),
                    Math.round(mapOptions.iconHeight)
                ),
                scaledSize: new google.maps.Size(
                    Math.round(mapOptions.iconWidth),
                    Math.round(mapOptions.iconHeight)
                )
            };

            var positionObject = new google.maps.LatLng(lat, lng);

            var marker = new google.maps.Marker({
                position: positionObject,
                map:      MyMap.map,
                icon:     iconConfig
            });

            MyMap.boundsManager.extend(positionObject);

            google.maps.event.addListener(
                marker,
                'click',
                (function(marker, markerNumber, id) {
                    return function() {
                        if(typeof MyMap.mapOptions.markerCallbackFX === 'function') {
                            MyMap.mapOptions.markerCallbackFX(marker, markerNumber, id);
                        } else {
                            infowindow.setContent('<h5>'+title + '</h5>' + '<address>'+address+'</address>');
                            infowindow.open(MyMap.map, marker);
                        }
                    }
                })(marker, markerNumber, id)
            );
            if(markerNumber == 0) {
                MyMap.map.setZoom(MyMap.zoom);
                MyMap.map.setCenter(positionObject);
            }
            else {
                MyMap.map.fitBounds(MyMap.boundsManager);
            }
        },

        addViaAddress: function(title, address, markerNumber) {
            if(this.geocoder === null) {
                this.geocoder = new google.maps.Geocoder();
            }
            this.geocoder.geocode(
                { 'address': address},
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        MyMap.addMarkerToMap(
                            title,
                            address,
                            results[0].geometry.location.lat(),
                            results[0].geometry.location.lng(),
                            markerNumber
                        );
                    }
                    else {
                        console.debug("Geocode was not successful for the following reason: " + status);
                    }
                }
            );
        }
    }


    /***
    * action time
    */

    MyMap.init(mapOptions);

    /**
     * exposed API
     *
     */
    return {
        map: MyMap.map,
        setVar: function(variable, value) {
            MyMap[variable] = value;
            return this;
        },
        getVar: function(variable) {
            return MyMap[variable]
        },
    };

}

jQuery(document).ready(
    function() {
        google.maps.event.addDomListener(
            window,
            "load",
            function () {
                if(typeof GoogleMapSmarterOptions !== "undefined") {
                    if(GoogleMapSmarterOptions.length > 0) {
                        jQuery(GoogleMapSmarterOptions).each(
                            function(i, mapOptions) {
                                mapOptions.map = new GoogleMapSmarter(mapOptions);
                                GoogleMapSmarterOptions[i]['map'] = new GoogleMapSmarter(mapOptions);
                            }
                        );
                    }
                }
            }
        );
    }
);
