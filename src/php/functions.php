<?php 

function divikid_enqueue_parent_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
}

add_action('wp_enqueue_scripts', 'divikid_enqueue_parent_styles');
 
 
//you can add custom functions below this line:
