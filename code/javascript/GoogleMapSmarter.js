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
 *  - markerCallBack: function() { ... }
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
                {title: "Address 1", lat: -42, lng: 179.3, id: 1},
                {title: "Address 1", lat: -43, lng: 171.3, id: 2}
            ],
            markerCallBack: null
        },

        init: function(mapOptions) {
            this.mapOptions =  jQuery.extend(this.mapOptions, mapOptions);

            MyMap.map = new google.maps.Map(
                document.getElementById(this.mapOptions.id),
                {
                    center: {lat: MyMap.mapOptions.defaultLocation.lat, lng: MyMap.mapOptions.defaultLocation.lng},
                    zoom: 8,
                    options: {styles: MyMap.mapStyling},
                    disableDefaultUI: true
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
            divider = 1;
            if(MyMap.mapOptions.iconIsRetinaSize) {
                divider = 2
            }
            var iconConfig = {
                url: MyMap.mapOptions.iconURL,

                size: new google.maps.Size(
                    mapOptions.iconWidth,
                    mapOptions.iconHeight
                ),
                anchor: new google.maps.Point(
                    Math.round(mapOptions.iconWidth / (4 * divider)),
                    Math.round(mapOptions.iconHeight / (4 * divider))
                ),
                scaledSize: new google.maps.Size(
                    Math.round(mapOptions.iconWidth / (1 * divider)),
                    Math.round(mapOptions.iconHeight / (1 * divider))
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
                        if(typeof MyMap.mapOptions.markerCallBack === 'function') {
                            MyMap.mapOptions.markerCallBack(marker, markerNumber, id);
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


        /***
        * action time
        */
    }

    MyMap.init(mapOptions);

}

jQuery(document).ready(
    function() {
        google.maps.event.addDomListener(
            window,
            "load",
            function () {
                if(typeof GoogleMapSmarterOptions !== "undefined") {
                    if(GoogleMapLocationsForPage.length > 0) {
                        jQuery(GoogleMapSmarterOptions).each(
                            function(i, mapOptions) {
                                var obj = new GoogleMapSmarter(mapOptions);
                            }
                        );
                    }
                }
            }
        );
    }
);
