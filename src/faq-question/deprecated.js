/**
 * WordPress dependencies
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save function for deprecated 2.0.x markup with faq__title and faq__trigger classes.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
function deprecatedSave( { attributes } ) {
	const { question, isAccordion = true } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'faq__title',
	} );

	const TriggerTag = isAccordion ? 'button' : 'span';
	const triggerProps = isAccordion
		? { className: 'faq__trigger', 'aria-expanded': 'false' }
		: { className: 'faq__trigger' };

	return (
		<h3 { ...blockProps }>
			<TriggerTag { ...triggerProps }>
				{ isAccordion ? (
					<RichText.Content tagName="span" value={ question } />
				) : (
					<InnerBlocks.Content />
				) }
			</TriggerTag>
		</h3>
	);
}

const deprecated = [
	{
		attributes: {
			question: {
				type: 'string',
				default: '',
			},
			isAccordion: {
				type: 'boolean',
				default: true,
			},
		},
		save: deprecatedSave,
	},
];

export default deprecated;
