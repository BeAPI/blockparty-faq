<?php

namespace Blockparty\Faq\Services;

use Blockparty\Faq\Schema\FAQ_Schema;

/**
 * Yoast SEO integration for FAQ structured data.
 */
class Yoast_Seo_Service implements Seo_Service_Interface {

	/**
	 * @inheritDoc
	 */
	public function get_slug(): string {
		return 'yoast';
	}

	/**
	 * @inheritDoc
	 */
	public function is_active(): bool {
		return defined( 'WPSEO_VERSION' );
	}

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		add_filter( 'wpseo_schema_graph_pieces', [ $this, 'add_graph_pieces' ], 11, 2 );
	}

	/**
	 * Adds FAQ schema pieces to the Yoast graph.
	 *
	 * @param array<int, object>    $pieces  Graph pieces to output.
	 * @param \WPSEO_Schema_Context $context Yoast schema context.
	 *
	 * @return array<int, object>
	 */
	public function add_graph_pieces( array $pieces, \WPSEO_Schema_Context $context ): array {
		$pieces[] = new FAQ_Schema( $context );

		return $pieces;
	}
}
