/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
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
