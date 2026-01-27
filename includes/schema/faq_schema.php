<?php

namespace Blockparty\Faq\Schema;

class FAQ_Schema {

	/**
	 * A value object with context variables.
	 *
	 * @var \WPSEO_Schema_Context
	 */
	public $context;

	/**
	 * Team_Member constructor.
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
		if ( empty( $this->context->blocks['blockparty/faq'] ) ) {
			return false;
		}

		if ( ! \is_array( $this->context->schema_page_type ) ) {
			$this->context->schema_page_type = [ $this->context->schema_page_type ];
		}
		$this->context->schema_page_type[]  = 'FAQPage';
		$this->context->main_entity_of_page = $this->generate_ids();

		return true;
	}

	/**
	 * Generate the IDs so we can link to them in the main entity.
	 *
	 * @return array
	 */
	private function generate_ids(): array {
		$ids = [];
		foreach ( $this->context->blocks['blockparty/faq'] as $block ) {
			if ( empty( $block['innerBlocks'] ) ) {
				continue;
			}

			// Process faq-item blocks
			foreach ( $block['innerBlocks'] as $item_block ) {
				if ( 'blockparty/faq-item' !== $item_block['blockName'] ) {
					continue;
				}

				if ( empty( $item_block['innerBlocks'] ) ) {
					continue;
				}

				// Find question block in faq-item
				$question_block = null;
				foreach ( $item_block['innerBlocks'] as $inner_block ) {
					if ( 'blockparty/faq-question' === $inner_block['blockName'] ) {
						$question_block = $inner_block;
						break;
					}
				}

				if ( ! $question_block ) {
					continue;
				}

				// Get question text from attributes or InnerBlocks
				$question_text = $question_block['attrs']['question'] ?? '';

				// If question is empty, try to get it from InnerBlocks (when isAccordion is false)
				if ( empty( $question_text ) && ! empty( $question_block['innerBlocks'] ) ) {
					$question_text = $this->get_question_content( $question_block );
				}

				$question_id = ! empty( $question_text )
					? md5( $question_text )
					: 'faq-' . uniqid();
				$ids[]       = [ '@id' => $this->context->canonical . '#' . \esc_attr( $question_id ) ];
			}
		}

		return $ids;
	}

	/**
	 * Render a list of questions, referencing them by ID.
	 *
	 * @return array Our Schema graph.
	 */
	public function generate(): array {
		$graph = [];

		foreach ( $this->context->blocks['blockparty/faq'] as $block ) {
			if ( empty( $block['innerBlocks'] ) ) {
				continue;
			}

			$position = 1;

			// Process faq-item blocks
			foreach ( $block['innerBlocks'] as $item_block ) {
				if ( 'blockparty/faq-item' !== $item_block['blockName'] ) {
					continue;
				}

				if ( empty( $item_block['innerBlocks'] ) ) {
					continue;
				}

				// Find question and answer blocks in faq-item
				$question_block = null;
				$answer_block   = null;

				foreach ( $item_block['innerBlocks'] as $inner_block ) {
					if ( 'blockparty/faq-question' === $inner_block['blockName'] ) {
						$question_block = $inner_block;
					} elseif ( 'blockparty/faq-answer' === $inner_block['blockName'] ) {
						$answer_block = $inner_block;
					}
				}

				// Skip if no question block
				if ( ! $question_block ) {
					continue;
				}

				// Get question text from attributes or InnerBlocks
				$question_text = $question_block['attrs']['question'] ?? '';

				// If question is empty, try to get it from InnerBlocks (when isAccordion is false)
				if ( empty( $question_text ) && ! empty( $question_block['innerBlocks'] ) ) {
					$question_text = $this->get_question_content( $question_block );
				}

				if ( empty( $question_text ) ) {
					continue;
				}

				// Get answer content from InnerBlocks
				$answer_content = '';
				if ( $answer_block ) {
					$answer_content = $this->get_answer_content( $answer_block );
				}

				if ( empty( $answer_content ) ) {
					continue;
				}

				$question_id = md5( $question_text );
				$graph[]     = $this->generate_question_block(
					$question_text,
					$answer_content,
					$question_id,
					$position
				);
				++$position;
			}
		}

		return $graph;
	}

	/**
	 * Get question content from InnerBlocks.
	 *
	 * @param array $question_block The question block with InnerBlocks.
	 * @return string The question content as HTML.
	 */
	protected function get_question_content( array $question_block ): string {
		if ( empty( $question_block['innerBlocks'] ) ) {
			return '';
		}

		$content = '';
		foreach ( $question_block['innerBlocks'] as $inner_block ) {
			$content .= render_block( $inner_block );
		}

		return wp_strip_all_tags( $content );
	}

	/**
	 * Get answer content from InnerBlocks.
	 *
	 * @param array $answer_block The answer block with InnerBlocks.
	 * @return string The answer content as HTML.
	 */
	protected function get_answer_content( array $answer_block ): string {
		if ( empty( $answer_block['innerBlocks'] ) ) {
			return '';
		}

		$content = '';
		foreach ( $answer_block['innerBlocks'] as $inner_block ) {
			$content .= render_block( $inner_block );
		}

		return $content;
	}

	/**
	 * Generate a Question piece.
	 *
	 * @param string $question_text The question text.
	 * @param string $answer_content The answer content as HTML.
	 * @param string $question_id The question ID.
	 * @param int $position The position of the question.
	 *
	 * @return array Schema.org Question piece.
	 */
	protected function generate_question_block( string $question_text, string $answer_content, string $question_id, int $position ): array {
		$url = $this->context->canonical . '#' . \esc_attr( $question_id );

		$data = [
			'@type'          => 'Question',
			'@id'            => $url,
			'position'       => $position,
			'url'            => $url,
			'name'           => esc_html( $question_text ),
			'answerCount'    => 1,
			'acceptedAnswer' => $this->add_accepted_answer_property( $answer_content ),
		];

		$data['inLanguage'] = get_bloginfo( 'language' );

		return $data;
	}

	/**
	 * Adds the Questions `acceptedAnswer` property.
	 *
	 * @param string $answer The question to add the acceptedAnswer to.
	 *
	 * @return array Schema.org Question piece.
	 */
	protected function add_accepted_answer_property( string $answer ): array {
		// Allowed HTML elements and attributes for Schema.org FAQPage acceptedAnswer text property.
		// Supports: headings, paragraphs, lists.
		$allowed_html = [
			'h1'         => [],
			'h2'         => [],
			'h3'         => [],
			'h4'         => [],
			'h5'         => [],
			'h6'         => [],
			'p'          => [],
			'br'         => [],
			'ol'         => [],
			'ul'         => [],
			'li'         => [],
			'a'          => [
				'href'  => [],
				'title' => [],
			],
			'b'          => [],
			'strong'     => [],
			'i'          => [],
			'em'         => [],
		];

		$data = [
			'@type' => 'Answer',
			'text'  => wp_kses( wp_unslash( $answer ), $allowed_html ),
		];

		$data['inLanguage'] = get_bloginfo( 'language' );

		return $data;
	}
}
