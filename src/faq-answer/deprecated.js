/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save function for deprecated 2.0.x markup with faq__panel class.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
function deprecatedSave( { attributes } ) {
	const { isAccordion = true } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'faq__panel',
	} );

	const divProps = isAccordion
		? { ...blockProps, role: 'region' }
		: blockProps;

	return (
		<div { ...divProps }>
			<InnerBlocks.Content />
		</div>
	);
}

const deprecated = [
	{
		attributes: {
			isAccordion: {
				type: 'boolean',
				default: true,
			},
		},
		save: deprecatedSave,
	},
];

export default deprecated;
