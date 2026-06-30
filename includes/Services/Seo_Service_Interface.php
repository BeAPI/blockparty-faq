<?php

namespace Blockparty\Faq\Services;

/**
 * Contract for SEO plugin schema integrations.
 */
interface Seo_Service_Interface {

	/**
	 * Unique service identifier (e.g. yoast, seopress).
	 *
	 * @return string
	 */
	public function get_slug(): string;

	/**
	 * Whether the SEO plugin is active and available.
	 *
	 * @return bool
	 */
	public function is_active(): bool;

	/**
	 * Register hooks required by the SEO plugin integration.
	 *
	 * @return void
	 */
	public function register(): void;
}
