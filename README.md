# example usage:


Dynamic Map
---

```php

    foreach($objects as $obj) {
        $points[] = array(
            'title' => $obj->Title,
            'address' => $obj->ProperAddress(),
            'lat' => $obj->Lat,
            'lng' => $obj->Lng,
            'id' => 'listing-'.$obj->ID
        );
    }
    $obj = Injector::inst()->get('DynamicGoogleMapSmarter');
    $obj->setIconURL('themes/mytheme/images/coolicon.png');
    $obj->setIconWidth(20);
    $obj->setIconHeight(40);
    $obj->setDefaultZoom(9);
    $obj->setMarkerCallbackFX(
        '
            function(marker, markerNumber, id) {
                jQuery(\'#\'+id).addClass('highlight');
            }
        '
    );
    $obj->createMap($points);

```


Static map
---

Note, location can also be an address...

```php
    $locationsAndIcons = array();
    $iconLink = 'themes/mytheme/images/coolicon.png';
    foreach($objects as $obj) {
        $location = $obj->Lat.','.$obj->Lng;
        $locationsAndIcons[]  = array($location, $iconLink);
    }
    return StaticGoogleMapSmarter::create_map(
        200,
        200,
        $locationsAndIcons
    );

```
