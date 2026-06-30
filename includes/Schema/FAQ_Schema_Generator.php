<?php

namespace Blockparty\Faq\Schema;

/**
 * Builds FAQ structured data from blockparty/faq blocks.
 *
 * Plugin-agnostic: consumed by Yoast and SEOPress integrations.
 */
class FAQ_Schema_Generator {

	/**
	 * Canonical URL used for question fragment identifiers.
	 *
	 * @var string
	 */
	private string $canonical;

	/**
	 * Parsed blockparty/faq blocks from the current content.
	 *
	 * @var array<int, array<string, mixed>>
	 */
	private array $faq_blocks;

	/**
	 * @param string                           $canonical  Canonical URL for the current page.
	 * @param array<int, array<string, mixed>> $faq_blocks Parsed blockparty/faq blocks.
	 */
	public function __construct( string $canonical, array $faq_blocks ) {
		$this->canonical  = $canonical;
		$this->faq_blocks = $faq_blocks;
	}

	/**
	 * Whether FAQ blocks are available for schema generation.
	 *
	 * @return bool
	 */
	public function has_faq_blocks(): bool {
		return ! empty( $this->faq_blocks );
	}

	/**
	 * Collect blockparty/faq blocks from post content.
	 *
	 * @param \WP_Post|null $post Post object. Defaults to the current global post.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public static function get_faq_blocks_from_post( ?\WP_Post $post = null ): array {
		$post = $post ?? get_post();

		if ( ! $post instanceof \WP_Post ) {
			return [];
		}

		$blocks = parse_blocks( $post->post_content );

		return self::find_blocks_by_name( $blocks, 'blockparty/faq' );
	}

	/**
	 * Recursively find blocks by name in a parsed block tree.
	 *
	 * @param array<int, array<string, mixed>> $blocks    Parsed blocks.
	 * @param string                           $block_name Block name to match.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public static function find_blocks_by_name( array $blocks, string $block_name ): array {
		$found = [];

		foreach ( $blocks as $block ) {
			if ( ( $block['blockName'] ?? '' ) === $block_name ) {
				$found[] = $block;
			}

			if ( ! empty( $block['innerBlocks'] ) ) {
				$found = array_merge(
					$found,
					self::find_blocks_by_name( $block['innerBlocks'], $block_name )
				);
			}
		}

		return $found;
	}

	/**
	 * Generate main entity @id references for Yoast FAQPage integration.
	 *
	 * @return array<int, array<string, string>>
	 */
	public function generate_main_entity_ids(): array {
		$ids = [];

		foreach ( $this->faq_blocks as $block ) {
			if ( empty( $block['innerBlocks'] ) ) {
				continue;
			}

			foreach ( $block['innerBlocks'] as $item_block ) {
				if ( 'blockparty/faq-item' !== ( $item_block['blockName'] ?? '' ) ) {
					continue;
				}

				$question_block = self::find_child_block( $item_block, 'blockparty/faq-question' );

				if ( ! $question_block ) {
					continue;
				}

				$question_text = self::get_question_text( $question_block );

				if ( empty( $question_text ) ) {
					continue;
				}

				$question_id = md5( $question_text );
				$ids[]       = [
					'@id' => $this->canonical . '#' . esc_attr( $question_id ),
				];
			}
		}

		return $ids;
	}

	/**
	 * Generate Schema.org Question pieces (Yoast graph format).
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function generate_questions(): array {
		$graph    = [];
		$position = 1;

		foreach ( $this->faq_blocks as $block ) {
			if ( empty( $block['innerBlocks'] ) ) {
				continue;
			}

			foreach ( $block['innerBlocks'] as $item_block ) {
				if ( 'blockparty/faq-item' !== ( $item_block['blockName'] ?? '' ) ) {
					continue;
				}

				if ( empty( $item_block['innerBlocks'] ) ) {
					continue;
				}

				$question_block = self::find_child_block( $item_block, 'blockparty/faq-question' );
				$answer_block   = self::find_child_block( $item_block, 'blockparty/faq-answer' );

				if ( ! $question_block ) {
					continue;
				}

				$question_text = self::get_question_text( $question_block );

				if ( empty( $question_text ) ) {
					continue;
				}

				$answer_content = '';

				if ( $answer_block ) {
					$answer_content = self::get_answer_content( $answer_block );
				}

				if ( empty( $answer_content ) ) {
					continue;
				}

				$question_id = md5( $question_text );
				$graph[]     = self::build_question_piece(
					$question_text,
					$answer_content,
					$question_id,
					$position,
					$this->canonical
				);
				++$position;
			}
		}

		return $graph;
	}

	/**
	 * Generate a FAQPage schema (SEOPress format).
	 *
	 * @return array<string, mixed>|null
	 */
	public function generate_faq_page_schema(): ?array {
		$questions = $this->generate_questions_for_nested_schema();

		if ( empty( $questions ) ) {
			return null;
		}

		return [
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => $questions,
		];
	}

	/**
	 * Generate Question entries for nested FAQPage mainEntity (SEOPress).
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function generate_questions_for_nested_schema(): array {
		$questions = [];
		$position  = 1;

		foreach ( $this->faq_blocks as $block ) {
			if ( empty( $block['innerBlocks'] ) ) {
				continue;
			}

			foreach ( $block['innerBlocks'] as $item_block ) {
				if ( 'blockparty/faq-item' !== ( $item_block['blockName'] ?? '' ) ) {
					continue;
				}

				if ( empty( $item_block['innerBlocks'] ) ) {
					continue;
				}

				$question_block = self::find_child_block( $item_block, 'blockparty/faq-question' );
				$answer_block   = self::find_child_block( $item_block, 'blockparty/faq-answer' );

				if ( ! $question_block ) {
					continue;
				}

				$question_text = self::get_question_text( $question_block );

				if ( empty( $question_text ) ) {
					continue;
				}

				$answer_content = '';

				if ( $answer_block ) {
					$answer_content = self::get_answer_content( $answer_block );
				}

				if ( empty( $answer_content ) ) {
					continue;
				}

				$questions[] = [
					'@type'          => 'Question',
					'position'       => $position,
					'name'           => esc_html( wp_strip_all_tags( $question_text ) ),
					'answerCount'    => 1,
					'acceptedAnswer' => self::build_accepted_answer( $answer_content ),
				];
				++$position;
			}
		}

		return $questions;
	}

	/**
	 * Find a direct child block by name.
	 *
	 * @param array<string, mixed> $parent_block Parent block.
	 * @param string               $block_name   Block name to find.
	 *
	 * @return array<string, mixed>|null
	 */
	private static function find_child_block( array $parent_block, string $block_name ): ?array {
		if ( empty( $parent_block['innerBlocks'] ) ) {
			return null;
		}

		foreach ( $parent_block['innerBlocks'] as $inner_block ) {
			if ( ( $inner_block['blockName'] ?? '' ) === $block_name ) {
				return $inner_block;
			}
		}

		return null;
	}

	/**
	 * Get question text from block attributes or InnerBlocks.
	 *
	 * @param array<string, mixed> $question_block Question block.
	 *
	 * @return string
	 */
	private static function get_question_text( array $question_block ): string {
		$question_text = $question_block['attrs']['question'] ?? '';

		if ( empty( $question_text ) && ! empty( $question_block['innerBlocks'] ) ) {
			$question_text = self::get_question_content( $question_block );
		}

		return $question_text;
	}

	/**
	 * Get question content from InnerBlocks.
	 *
	 * @param array<string, mixed> $question_block Question block with InnerBlocks.
	 *
	 * @return string
	 */
	private static function get_question_content( array $question_block ): string {
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
	 * @param array<string, mixed> $answer_block Answer block with InnerBlocks.
	 *
	 * @return string
	 */
	private static function get_answer_content( array $answer_block ): string {
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
	 * Build a Schema.org Question piece (Yoast graph node).
	 *
	 * @param string $question_text  Question text.
	 * @param string $answer_content Answer HTML content.
	 * @param string $question_id    Question identifier.
	 * @param int    $position       Question position.
	 * @param string $canonical      Canonical URL.
	 *
	 * @return array<string, mixed>
	 */
	private static function build_question_piece(
		string $question_text,
		string $answer_content,
		string $question_id,
		int $position,
		string $canonical
	): array {
		$url = $canonical . '#' . esc_attr( $question_id );

		return [
			'@type'          => 'Question',
			'@id'            => $url,
			'position'       => $position,
			'url'            => $url,
			'name'           => esc_html( wp_strip_all_tags( $question_text ) ),
			'answerCount'    => 1,
			'acceptedAnswer' => self::build_accepted_answer( $answer_content ),
			'inLanguage'     => get_bloginfo( 'language' ),
		];
	}

	/**
	 * Build a Schema.org Answer piece.
	 *
	 * @param string $answer Answer HTML content.
	 *
	 * @return array<string, mixed>
	 */
	private static function build_accepted_answer( string $answer ): array {
		$allowed_html = [
			'h1'     => [],
			'h2'     => [],
			'h3'     => [],
			'h4'     => [],
			'h5'     => [],
			'h6'     => [],
			'p'      => [],
			'br'     => [],
			'ol'     => [],
			'ul'     => [],
			'li'     => [],
			'a'      => [
				'href'  => [],
				'title' => [],
			],
			'b'      => [],
			'strong' => [],
			'i'      => [],
			'em'     => [],
		];

		return [
			'@type'      => 'Answer',
			'text'       => wp_kses( wp_unslash( $answer ), $allowed_html ),
			'inLanguage' => get_bloginfo( 'language' ),
		];
	}
}
