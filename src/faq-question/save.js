/**
 * WordPress dependencies
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { question, isAccordion = true, headingLevel = 3 } = attributes;
	const blockProps = useBlockProps.save();
	const HeadingTag = `h${ headingLevel }`;

	if ( ! isAccordion ) {
		return (
			<h3 { ...blockProps }>
				<InnerBlocks.Content />
			</h3>
		);
	}

	return (
		<HeadingTag { ...blockProps }>
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
		</HeadingTag>
	);
}
