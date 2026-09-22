<?php

namespace Blockparty\Faq\Hooks;

/**
 * Declare FAQ block attributes that Polylang Pro should translate.
 *
 * Without this, Autopoly translates the saved HTML of faq-question but leaves
 * the `question` attribute in the source language, which breaks block validation.
 *
 * @param array $rules Parsing rules keyed by block name, then attribute name.
 *
 * @return array
 */
function translate_block_attributes( array $rules ): array {
	$rules['blockparty/faq-question'] = [
		'question' => true,
	];

	return $rules;
}

add_filter( 'pll_blocks_rules_for_attributes', __NAMESPACE__ . '\\translate_block_attributes' );
