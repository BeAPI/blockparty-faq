/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/buttons',
	'core/button',
];

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<div className="wp-block-blockparty-faq-answer__inner">
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ [
						[
							'core/paragraph',
							{
								placeholder: __( 'Answer…', 'blockparty-faq' ),
							},
						],
					] }
					templateLock={ false }
				/>
			</div>
		</div>
	);
}
