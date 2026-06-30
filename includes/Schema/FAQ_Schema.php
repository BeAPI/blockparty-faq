<?php

namespace Blockparty\Faq\Schema;

/**
 * Yoast SEO graph piece for FAQ structured data.
 */
class FAQ_Schema {

	/**
	 * A value object with context variables.
	 *
	 * @var \WPSEO_Schema_Context
	 */
	public $context;

	/**
	 * FAQ schema generator.
	 *
	 * @var FAQ_Schema_Generator|null
	 */
	private ?FAQ_Schema_Generator $generator = null;

	/**
	 * FAQ_Schema constructor.
	 *
	 * @param \WPSEO_Schema_Context $context Value object with context variables.
	 */
	public function __construct( \WPSEO_Schema_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool Whether or not a piece should be added.
	 */
	public function is_needed(): bool {
		$generator = $this->get_generator();

		if ( ! $generator->has_faq_blocks() ) {
			return false;
		}

		if ( ! \is_array( $this->context->schema_page_type ) ) {
			$this->context->schema_page_type = [ $this->context->schema_page_type ];
		}

		$this->context->schema_page_type[]  = 'FAQPage';
		$this->context->main_entity_of_page = $generator->generate_main_entity_ids();

		return true;
	}

	/**
	 * Render a list of questions, referencing them by ID.
	 *
	 * @return array<int, array<string, mixed>> Schema graph pieces.
	 */
	public function generate(): array {
		return $this->get_generator()->generate_questions();
	}

	/**
	 * Get or create the FAQ schema generator from Yoast context.
	 *
	 * @return FAQ_Schema_Generator
	 */
	private function get_generator(): FAQ_Schema_Generator {
		if ( null !== $this->generator ) {
			return $this->generator;
		}

		$faq_blocks = $this->context->blocks['blockparty/faq'] ?? [];

		$this->generator = new FAQ_Schema_Generator(
			$this->context->canonical,
			$faq_blocks
		);

		return $this->generator;
	}
}
