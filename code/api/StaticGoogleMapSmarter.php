<?php


class StaticGoogleMapSmarter extends Object
{
    /**
     * Array is Formatted Like This:
     * LocationOfIcon, LinkOfMapPin
     * Locations can be: 12 Main Street, bla bla OR -45,180 (lat, lng)
     * Icon can be something like: /themes/mysite/images/MyIcon.png (max 64 x 64)
     *
     *
     * @param  int  $width
     * @param  int  $height
     * @param  array  $locationsAndIcons
     *
     * @return string
     */
    public static function create_map($width = 640, $height = 640, $locationsAndIcons = array())
    {
        $link = 'http://maps.googleapis.com/maps/api/staticmap?'.
            'autoscale=2'.
            '&size='.$width.'x'.$height.
            '&type=roadmap'.
            '&format=png'.
            '&visual_refresh=true';
        $key = Config::inst()->get('GoogleMapSmarter', 'api_key');
        if($key) {
            $link .= '&key='.Config::inst()->get('GoogleMapSmarter', 'api_key');
        }


        foreach($locationsAndIcons as $locationAndIcon) {
            $location = $locationAndIcon[0];
            $iconLink = isset($locationAndIcon[1]) ? urlencode(Director::absoluteURL($locationAndIcon[1])) : '';
            if($iconLink & 1 === 2) {
                $link .= '&markers=icon:'.$iconLink.'%7Cshadow:true%7C'.$location;
            }
            else {
                $link .= '&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C'.$location;
            }
        }
        return $link;
    }
    
}
