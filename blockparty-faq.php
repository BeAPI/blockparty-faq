<?php
/**
 * Plugin Name:       Blockparty FAQ
 * Description:       A FAQ block for WordPress Editor that provided structured data based on FAQ schema.
 * Requires at least: 6.2
 * Requires PHP:      8.1
 * Version:           1.0.2
 * Plugin URI: https://beapi.fr
 * Author: Be API Technical team
 * Author URI: https://beapi.fr
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blockparty-faq
 *
 * @package           create-block
 *
 * ----
 *
 * Copyright 2021 Be API Technical team (human@beapi.fr)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

namespace Blockparty\Faq;

// don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

// Plugin constants
define( 'BLOCKPARTY_FAQ_VERSION', '1.0.2' );

// Plugin URL and PATH
define( 'BLOCKPARTY_FAQ_DIR', plugin_dir_path( __FILE__ ) );

// Hooks
require_once BLOCKPARTY_FAQ_DIR . 'includes/hooks/schema.php';
require_once BLOCKPARTY_FAQ_DIR . 'includes/schema/faq_schema.php';

/**
 * Load plugin text domain for PHP translations (PO/MO files).
 *
 * @since 1.0.2
 *
 * @return void
 */
function blockparty_faq_load_textdomain(): void {
	load_plugin_textdomain(
		'blockparty-faq',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\blockparty_faq_load_textdomain' );

/**
 * Load JavaScript translations (JSON files) for blocks.
 *
 * @since 1.0.2
 *
 * @return void
 */
function blockparty_faq_set_script_translations(): void {
	if ( ! function_exists( 'wp_set_script_translations' ) ) {
		return;
	}

	// WordPress generates handles for block scripts based on block name and script type
	// For blockparty/faq with editorScript, the handle is: blockparty-faq-editor-script
	$script_handle = 'blockparty-faq-editor-script';

	wp_set_script_translations(
		$script_handle,
		'blockparty-faq',
		BLOCKPARTY_FAQ_DIR . 'languages'
	);
}

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\blockparty_faq_set_script_translations', 1 );

/**
 * Initialize plugin blocks.
 *
 * @since 1.0.0
 *
 * @return void
 */
function blockparty_faq_init(): void {
	// Register main block (from root block.json)
	register_block_type( __DIR__ );

	// Register child blocks
	// These blocks are also registered via JavaScript in src/index.js,
	// but we need to register them in PHP so WordPress knows about their block.json metadata
	register_block_type( __DIR__ . '/src/faq-item' );
	register_block_type( __DIR__ . '/src/faq-question' );
	register_block_type( __DIR__ . '/src/faq-answer' );
}

add_action( 'init', __NAMESPACE__ . '\\blockparty_faq_init' );
