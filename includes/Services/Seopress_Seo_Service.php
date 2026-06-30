<?php

namespace Blockparty\Faq\Services;

use Blockparty\Faq\Schema\FAQ_Schema_Generator;

/**
 * SEOPress integration for FAQ structured data.
 */
class Seopress_Seo_Service implements Seo_Service_Interface {

	/**
	 * Whether FAQ schema was already injected through a SEOPress filter.
	 *
	 * @var bool
	 */
	private bool $schema_injected = false;

	/**
	 * @inheritDoc
	 */
	public function get_slug(): string {
		return 'seopress';
	}

	/**
	 * @inheritDoc
	 */
	public function is_active(): bool {
		return defined( 'SEOPRESS_VERSION' );
	}

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		add_filter( 'seopress_schemas_auto_faq_json', [ $this, 'filter_auto_faq_json' ], 10, 1 );
		add_filter( 'seopress_pro_get_json_data_faq', [ $this, 'filter_manual_faq_json' ], 10, 2 );
		add_action( 'wp_head', [ $this, 'maybe_output_faq_schema' ], 99 );
	}

	/**
	 * Inject block FAQ data into SEOPress automatic FAQ schema.
	 *
	 * @param array<string, mixed> $json FAQ schema array.
	 *
	 * @return array<string, mixed>
	 */
	public function filter_auto_faq_json( array $json ): array {
		$merged = $this->merge_block_faq_into_schema( $json );

		if ( null !== $merged ) {
			$this->schema_injected = true;
		}

		return $merged ?? $json;
	}

	/**
	 * Inject block FAQ data into SEOPress manual FAQ schema.
	 *
	 * @param array<string, mixed> $jsonld  FAQ schema array.
	 * @param array<string, mixed> $context SEOPress schema context.
	 *
	 * @return array<string, mixed>
	 */
	public function filter_manual_faq_json( array $jsonld, array $context ): array {
		unset( $context );

		$merged = $this->merge_block_faq_into_schema( $jsonld );

		if ( null !== $merged ) {
			$this->schema_injected = true;
		}

		return $merged ?? $jsonld;
	}

	/**
	 * Output FAQ schema on singular views when SEOPress filters did not run.
	 *
	 * @return void
	 */
	public function maybe_output_faq_schema(): void {
		if ( $this->schema_injected || ! is_singular() ) {
			return;
		}

		$generator = $this->create_generator_from_current_post();

		if ( null === $generator ) {
			return;
		}

		$schema = $generator->generate_faq_page_schema();

		if ( null === $schema ) {
			return;
		}

		$this->schema_injected = true;

		printf(
			'<script type="application/ld+json">%s</script>' . "\n",
			wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
		);
	}

	/**
	 * Merge block FAQ questions into an existing FAQ schema array.
	 *
	 * @param array<string, mixed> $json Existing FAQ schema.
	 *
	 * @return array<string, mixed>|null
	 */
	private function merge_block_faq_into_schema( array $json ): ?array {
		$generator = $this->create_generator_from_current_post();

		if ( null === $generator ) {
			return null;
		}

		$questions = $generator->generate_questions_for_nested_schema();

		if ( empty( $questions ) ) {
			return null;
		}

		$existing_questions = $this->normalize_main_entity( $json['mainEntity'] ?? [] );
		$merged_questions   = array_merge( $existing_questions, $questions );

		$json['@type']      = 'FAQPage';
		$json['mainEntity'] = $this->renumber_question_positions( $merged_questions );
		$json['@context']   = $json['@context'] ?? 'https://schema.org';
		$json['inLanguage'] = $json['inLanguage'] ?? get_bloginfo( 'language' );

		return $json;
	}

	/**
	 * Normalize FAQPage mainEntity to a list of Question entries.
	 *
	 * @param mixed $main_entity FAQPage mainEntity value.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function normalize_main_entity( $main_entity ): array {
		if ( empty( $main_entity ) || ! is_array( $main_entity ) ) {
			return [];
		}

		if ( isset( $main_entity['@type'] ) ) {
			return [ $main_entity ];
		}

		return array_values(
			array_filter(
				$main_entity,
				static fn( $question ) => is_array( $question ) && ! empty( $question )
			)
		);
	}

	/**
	 * Ensure sequential position values on merged FAQ questions.
	 *
	 * @param array<int, array<string, mixed>> $questions Question entries.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function renumber_question_positions( array $questions ): array {
		$position = 1;

		foreach ( $questions as $index => $question ) {
			$questions[ $index ]['position'] = $position;
			++$position;
		}

		return $questions;
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
