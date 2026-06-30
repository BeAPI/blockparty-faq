<?php

namespace Blockparty\Faq\Services;

use Blockparty\Faq\Schema\FAQ_Schema_Generator;

/**
 * Rank Math SEO integration for FAQ structured data.
 */
class Rank_Math_Seo_Service implements Seo_Service_Interface {

	/**
	 * @inheritDoc
	 */
	public function get_slug(): string {
		return 'rank-math';
	}

	/**
	 * @inheritDoc
	 */
	public function is_active(): bool {
		return defined( 'RANK_MATH_VERSION' );
	}

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		add_filter( 'rank_math/json_ld', [ $this, 'filter_json_ld' ], 10, 2 );
	}

	/**
	 * Inject block FAQ data into Rank Math JSON-LD output.
	 *
	 * @param array<string, mixed> $data   Rank Math schema data.
	 * @param mixed                $jsonld Rank Math JsonLD instance.
	 *
	 * @return array<string, mixed>
	 */
	public function filter_json_ld( array $data, $jsonld ): array {
		unset( $jsonld );

		$generator = $this->create_generator_from_current_post();

		if ( null === $generator ) {
			return $data;
		}

		$questions = $generator->generate_questions_for_nested_schema();

		if ( empty( $questions ) ) {
			return $data;
		}

		$data['faqs'] = [
			'@type'      => 'FAQPage',
			'mainEntity' => $questions,
		];

		return $data;
	}

	/**
	 * Create a schema generator from the current singular post.
	 *
	 * @return FAQ_Schema_Generator|null
	 */
	private function create_generator_from_current_post(): ?FAQ_Schema_Generator {
		if ( ! is_singular() ) {
			return null;
		}

		$faq_blocks = FAQ_Schema_Generator::get_faq_blocks_from_post();

		if ( empty( $faq_blocks ) ) {
			return null;
		}

		$canonical = get_permalink( get_queried_object_id() );

		if ( ! is_string( $canonical ) || '' === $canonical ) {
			return null;
		}

		return new FAQ_Schema_Generator( $canonical, $faq_blocks );
	}
}
