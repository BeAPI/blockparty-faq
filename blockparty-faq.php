<?php
/**
 * Plugin Name:       Blockparty Faq
 * Description:       A Gutenberg block for SEO friendly FAQ in an accessible accordion
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

function blockparty_faq_init(): void {
	register_block_type( __DIR__ );
}

add_action( 'init', __NAMESPACE__ . '\\blockparty_faq_init' );
