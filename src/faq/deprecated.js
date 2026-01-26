/**
 * WordPress dependencies
 */
import { createBlock, parse } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

/**
 * Migration script to convert old FAQ format to new InnerBlocks format.
 *
 * Old format: questions array in attributes
 * New format: InnerBlocks with faq-item blocks
 *
 * @param {Object} attributes The block attributes.
 * @param {Array} innerBlocks The inner blocks.
 * @return {Array} Tuple array [attributes, innerBlocks] when migrating to InnerBlocks.
 */
function migrate( attributes, innerBlocks ) {
	// If no questions attribute, return existing innerBlocks (new format or empty block)
	// According to WordPress documentation, when returning only innerBlocks,
	// we should return a tuple: [attributes, innerBlocks]
	if (
		! attributes.questions ||
		! Array.isArray( attributes.questions ) ||
		attributes.questions.length === 0
	) {
		// Return tuple: [attributes, innerBlocks]
		return [
			{
				isAccordion:
					attributes.isAccordion !== undefined
						? attributes.isAccordion
						: true,
			},
			innerBlocks,
		];
	}

	const isAccordion =
		attributes.isAccordion !== undefined ? attributes.isAccordion : true;

	// Convert each question to a faq-item block
	const migratedBlocks = attributes.questions.map( ( question ) => {
		// Create faq-question block
		const questionBlock = createBlock( 'blockparty/faq-question', {
			question: question.question || '',
			isAccordion: isAccordion,
		} );

		// Create faq-answer block with content
		const answerContent = question.answer || '';

		// Create inner blocks for the answer
		let answerInnerBlocks = [];
		if ( answerContent ) {
			// Check if the answer contains HTML tags
			const hasHtmlTags = /<[a-z][\s\S]*>/i.test( answerContent );

			if ( hasHtmlTags ) {
				// Answer contains HTML: try to parse it into blocks
				try {
					const parsedBlocks = parse( answerContent );

					// If parsing succeeded and returned blocks, use them
					if ( parsedBlocks && parsedBlocks.length > 0 ) {
						answerInnerBlocks = parsedBlocks;
					} else {
						// Parsing didn't return blocks, create a paragraph with the HTML content
						answerInnerBlocks = [
							createBlock( 'core/paragraph', {
								content: answerContent,
							} ),
						];
					}
				} catch ( error ) {
					// If parsing fails, create a paragraph with the content
					answerInnerBlocks = [
						createBlock( 'core/paragraph', {
							content: answerContent,
						} ),
					];
				}
			} else {
				// Plain text: directly create a paragraph with the content
				answerInnerBlocks = [
					createBlock( 'core/paragraph', {
						content: answerContent,
					} ),
				];
			}
		} else {
			// Empty answer, create empty paragraph
			answerInnerBlocks = [ createBlock( 'core/paragraph' ) ];
		}

		const answerBlock = createBlock(
			'blockparty/faq-answer',
			{
				isAccordion: isAccordion,
			},
			answerInnerBlocks
		);

		// Create faq-item block containing question and answer
		return createBlock( 'blockparty/faq-item', {}, [
			questionBlock,
			answerBlock,
		] );
	} );

	// Return new attributes (without questions) and migrated innerBlocks
	// According to WordPress documentation, when migrating to InnerBlocks,
	// migrate() must return a tuple array: [attributes, innerBlocks]
	return [
		{
			isAccordion: isAccordion,
		},
		migratedBlocks,
	];
}

/**
 * Check if a block is eligible for migration.
 *
 * @param {Object} attributes The block attributes.
 * @param {Object} innerBlocks The inner blocks.
 * @return {boolean} Whether the block should be migrated.
 */
function isEligible( attributes, innerBlocks ) {
	// If questions attribute exists and has content, block needs migration
	return (
		attributes.questions &&
		Array.isArray( attributes.questions ) &&
		attributes.questions.length > 0
	);
}

/**
 * Save function for deprecated format.
 * Matches the old HTML structure to allow proper block validation.
 * The old format had: <div class="wp-block-blockparty-faq"><div class="faq__accordion">...
 *
 * @param {Object} props Component props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
function deprecatedSave( { attributes } ) {
	const { questions = [] } = attributes;
	const blockProps = useBlockProps.save();

	if ( ! questions || questions.length === 0 ) {
		return (
			<div { ...blockProps }>
				<div className="faq__accordion"></div>
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			<div className="faq__accordion">
				{ questions.map( ( item ) => (
					<div key={ item.id } className="faq__item">
						<h3 className="faq__title">
							<button
								className="faq__trigger"
								aria-expanded="false"
							>
								<RichText.Content
									tagName="span"
									value={ item.question }
								/>
							</button>
						</h3>
						<div className="faq__panel" role="region">
							<RichText.Content
								tagName="p"
								value={ item.answer }
							/>
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
}

/**
 * Deprecated block configuration for migration from old format.
 *
 * Old format: questions array in attributes
 * New format: InnerBlocks with faq-item blocks
 */
const deprecated = [
	{
		attributes: {
			questions: {
				type: 'array',
				default: [],
			},
			isAccordion: {
				type: 'boolean',
				default: true,
			},
		},
		supports: {
			html: false,
			innerBlocks: true,
		},
		isEligible,
		migrate,
		save: deprecatedSave,
	},
];

export default deprecated;
