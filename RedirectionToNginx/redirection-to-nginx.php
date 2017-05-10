<?php
/**
* The purpose of this script, is to convert the 301 redirects that live in WP Redirection and
* write them to a map file that can be included in nginx.conf.
* 
* @author Ryan Lanese <ryanlanese@gmail.com>
*/
require_once( 'wp-load.php' );

global $wpdb;
$prefix = $wpdb->prefix;
$redirect_file = 'site.redirects';
$redirect_table = "{$prefix}redirection_items";

$redirects = $wpdb->get_results(
    "SELECT url, regex, status, action_data FROM {$redirect_table}", ARRAY_A
);

foreach( $redirects as $redirect ) {
    if ( $redirect['status'] !== 'enabled' ) 
        continue;

    $source = $redirect['url'];
    $target = $redirect['action_data'];

    if ( $redirect['regex'] === '0' ) {
        $rewrites[] = "rewrite ^{$source}?$ {$target} permanent;";
    }
    else {
        if (strpos($source, '(/|[.-]?)') !== false) {
            $new_source = str_replace('(/|[.-]?)', '?(.*)', $source);
            $new_source = "^{$new_source}$";
        } elseif (strpos($source, '(\/|[.-]?)') !== false) {
            $new_source = str_replace('(\/|[.-]?)', '?(.*)', $source);
            $new_source = "^{$new_source}$";
        } elseif (strpos($source, '*') !== false) {
            $new_source = str_replace('*', '?(.*)', $source);
            $new_source = "^{$new_source}$";
        } else {
            $new_source = "^{$source}?$";
        }
        $rewrites[] = "rewrite {$new_source} {$target}$1 permanent;";
    }

}

$rewrites = join( $rewrites, "\n" );

file_put_contents( $redirect_file, $rewrites, FILE_APPEND | LOCK_EX );
?>