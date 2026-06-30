<?php

namespace Blockparty\Faq\Services;

/**
 * Resolves the active SEO plugin service for FAQ structured data.
 */
class Seo_Service_Resolver {

	/**
	 * Registered SEO service classes in priority order.
	 *
	 * @var array<int, class-string<Seo_Service_Interface>>
	 */
	private const SERVICE_CLASSES = [
		Yoast_Seo_Service::class,
		Rank_Math_Seo_Service::class,
		Seopress_Seo_Service::class,
	];

	/**
	 * Resolve the active SEO service.
	 *
	 * @return Seo_Service_Interface|null
	 */
	public static function resolve(): ?Seo_Service_Interface {
		/**
		 * Filter the list of SEO service classes used to resolve the active integration.
		 *
		 * @param array<int, class-string<Seo_Service_Interface>> $service_classes Service classes in priority order.
		 */
		$service_classes = apply_filters(
			'blockparty_faq_seo_service_classes',
			self::SERVICE_CLASSES
		);

		foreach ( $service_classes as $service_class ) {
			if ( ! is_subclass_of( $service_class, Seo_Service_Interface::class ) ) {
				continue;
			}

			$service = new $service_class();

			if ( ! $service->is_active() ) {
				continue;
			}

			/**
			 * Filter the resolved SEO service instance.
			 *
			 * @param Seo_Service_Interface $service       Resolved service.
			 * @param string                $service_class Service class name.
			 */
			return apply_filters( 'blockparty_faq_active_seo_service', $service, $service_class );
		}

		return null;
	}

	/**
	 * Register hooks for the active SEO service, if any.
	 *
	 * @return Seo_Service_Interface|null
	 */
	public static function register_active_service(): ?Seo_Service_Interface {
		$service = self::resolve();

		if ( null === $service ) {
			return null;
		}

		$service->register();

		return $service;
	}
}
