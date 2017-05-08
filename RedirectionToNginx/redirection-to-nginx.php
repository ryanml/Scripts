<?php
/**
* The purpose of this script, is to convert the 301 redirects that live in to WP Redirection and
* write them to a map file that can be included in to nginx.conf.
* 
* @author Ryan Lanese <ryanlanese@gmail.com>
*/
require_once( 'wp-load.php' );

global $wpdb;
$prefix = $wpdb->prefix;
$redirect_file = 'site.redirects';
$redirect_table = "{$prefix}redirection_items";

$redirects = $wpdb->get_results(
    "SELECT url, status, action_data FROM {$redirect_table}", ARRAY_A
);

foreach( $redirects as $redirect ) {
    if ( $redirect['status'] !== 'enabled' ) 
        continue;

    $source = $redirect['url'];
    $target = $redirect['action_data'];

    $rewrites[] = "rewrite {$source} {$target} permanent;";
}

$rewrites = join( $rewrites, "\n" );

file_put_contents( $redirect_file, $rewrites, FILE_APPEND | LOCK_EX );
?>