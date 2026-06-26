/**
 * WordPress dependencies
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { question, isAccordion = true } = attributes;
	const blockProps = useBlockProps.save();

	if ( ! isAccordion ) {
		return (
			<h3 { ...blockProps }>
				<InnerBlocks.Content />
			</h3>
		);
	}

	return (
		<h3 { ...blockProps }>
			<button
				aria-expanded="false"
				className="wp-block-blockparty-faq-trigger"
			>
				<RichText.Content
					tagName="span"
					className="wp-block-blockparty-faq-title"
					value={ question }
				/>
			</button>
		</h3>
	);
}
