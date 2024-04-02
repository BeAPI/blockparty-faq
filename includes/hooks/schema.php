<?php

namespace Blockparty\Faq\Hooks;

use Blockparty\Faq\Schema\FAQ_Schema;

/**
 * Adds Schema pieces to our output.
 *
 * @param array $pieces Graph pieces to output.
 * @param \WPSEO_Schema_Context $context Object with context variables.
 *
 * @return array Graph pieces to output.
 */
function yoast_add_graph_pieces( array $pieces, \WPSEO_Schema_Context $context ): array {
	$pieces[] = new FAQ_Schema( $context );

	return $pieces;
}

add_filter( 'wpseo_schema_graph_pieces', __NAMESPACE__ . '\\yoast_add_graph_pieces', 11, 2 );
