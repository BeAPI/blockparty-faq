/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
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
