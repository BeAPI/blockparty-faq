/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { isAccordion = true } = attributes;
	const blockProps = useBlockProps.save(
		isAccordion ? { role: 'region' } : {}
	);
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wp-block-blockparty-faq-answer__inner',
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}
