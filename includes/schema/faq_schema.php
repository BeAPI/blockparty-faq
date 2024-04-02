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
			if ( empty( $block['attrs']['questions'] ) ) {
				continue;
			}
			$all_faqs_id = wp_list_pluck( $block['attrs']['questions'], 'id' );

			if ( empty( $all_faqs_id ) ) {
				continue;
			}

			foreach ( $all_faqs_id as $question_id ) {
				$ids[] = [ '@id' => $this->context->canonical . '#' . \esc_attr( $question_id ) ];
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
		$graph     = [];
		$questions = [];

		foreach ( $this->context->blocks['blockparty/faq'] as $block ) {

			if ( empty( $block['attrs']['questions'] ) ) {
				continue;
			}

			$questions = array_merge( $questions, $block['attrs']['questions'] );
		}

		foreach ( $questions as $index => $question ) {
			if ( empty( $question['answer'] ) ) {
				continue;
			}
			$graph[] = $this->generate_question_block( $question, ( $index + 1 ) );
		}

		return $graph;
	}

	/**
	 * Generate a Question piece.
	 *
	 * @param array $question The question data to generate schema for.
	 * @param int $position The position of the question.
	 *
	 * @return array Schema.org Question piece.
	 */
	protected function generate_question_block( array $question, int $position ): array {
		$url = $this->context->canonical . '#' . \esc_attr( $question['id'] );

		$data = [
			'@type'          => 'Question',
			'@id'            => $url,
			'position'       => $position,
			'url'            => $url,
			'name'           => esc_html( $question['question'] ),
			'answerCount'    => 1,
			'acceptedAnswer' => $this->add_accepted_answer_property( $question['answer'] ),
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
		$data = [
			'@type' => 'Answer',
			'text'  => wp_strip_all_tags( wp_unslash( $answer ), '<h1><h2><h3><h4><h5><h6><br><ol><ul><li><a><p><b><strong><i><em>' ),
		];

		$data['inLanguage'] = get_bloginfo( 'language' );

		return $data;
	}
}
