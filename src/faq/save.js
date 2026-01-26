/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

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
