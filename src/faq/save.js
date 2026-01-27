/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div className="faq__accordion">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
