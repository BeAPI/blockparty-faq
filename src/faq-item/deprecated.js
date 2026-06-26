/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save function for deprecated 2.0.x markup with faq__item class.
 *
 * @return {JSX.Element} Saved block markup.
 */
function deprecatedSave() {
	const blockProps = useBlockProps.save( {
		className: 'faq__item',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}

const deprecated = [
	{
		save: deprecatedSave,
	},
];

export default deprecated;
