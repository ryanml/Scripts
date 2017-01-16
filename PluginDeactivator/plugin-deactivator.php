<?php 

// Stick this script in the root directory of you Wordpress site
// Run this http://site.com/plugin-deactivor.php?name={plugin-folder}

$plugin_folder = isset( $_GET['name'] ) ? $_GET['name'] : false;

if ( ! $plugin_folder ) 
    exit( 'No plugin specified in arguments.' );

require( dirname(__FILE__) . '/wp-load.php' );

if ( ! is_super_admin() )
    exit( 'You lack the permissions to access this page.' );

global $wpdb; 
$plugin_index = -1;
$table = $wpdb->prefix . 'options';

$active_plugins = $wpdb->get_results(
    "SELECT option_value FROM {$table} WHERE option_name='active_plugins'"
);
$active_plugins = unserialize( $active_plugins[0]->option_value );

foreach ( $active_plugins as $inc => $plugin ) {
    $split_file = explode( '/', $plugin );
    $folder_name = $split_file[0];

    if ( $plugin_folder === $folder_name ) {
        $plugin_index = $inc;
        break;
    }
}

if ( $plugin_index < 0 )
    exit( "Plugin folder with name {$plugin_folder} does not exist" );

unset( $active_plugins[$plugin_index] );
$active_plugins = serialize( $active_plugins );

$wpdb->query(
    "UPDATE {$table} SET option_value='{$active_plugins}' WHERE option_name='active_plugins'"
);

?>
