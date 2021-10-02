<?php
/**
* Plugin Name: UDSSL WP Redux Jest
*/
if( !defined( 'ABSPATH' ) ){
    header('HTTP/1.0 403 Forbidden');
    die('No Direct Access Allowed!');
}

/**
 * Add the shortcode [udssl_react] to display the react component
 */
add_shortcode('udssl_redux', 'udssl_render_react_component');
function udssl_render_react_component(){
    wp_enqueue_script('udssl_wp_react_bundle', plugins_url('dist/bundle.js', __FILE__), array(), false, true);
    wp_localize_script( 'udssl_wp_react_bundle', 'udssl_localize',
        array( 
            'resturl' => get_rest_url( null, 'udssl/v1/' ),
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
        )
    );

    return '<div id="udssl_wp_react_element"></div>';
}

/**
 * UDSSL REST API
 */
include_once 'udssl-rest-api.php';