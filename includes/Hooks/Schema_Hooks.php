<?php

namespace Blockparty\Faq\Hooks;

use Blockparty\Faq\Services\Seo_Service_Resolver;

/**
 * Bootstrap FAQ structured data integration with the active SEO plugin.
 *
 * @return void
 */
function register_schema_integration(): void {
	Seo_Service_Resolver::register_active_service();
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\register_schema_integration', 20 );
