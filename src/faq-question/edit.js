/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS_SIMPLE = [
	'core/heading',
	'core/paragraph',
];

export default function Edit( { attributes, setAttributes } ) {
	const { question, isAccordion = true } = attributes;
	const blockProps = useBlockProps( {
		className: 'faq__title',
	} );

	return (
		<h3 { ...blockProps }>
			<div className="faq__trigger">
				{ isAccordion ? (
					<RichText
						tagName="span"
						value={ question }
						onChange={ ( content ) =>
							setAttributes( { question: content } )
						}
						placeholder={ __( 'Question…?', 'blockparty-faq' ) }
						allowedFormats={ [] }
					/>
				) : (
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS_SIMPLE }
						template={ [
							[
								'core/paragraph',
								{
									placeholder: __( 'Question…?', 'blockparty-faq' ),
								},
							],
						] }
						templateLock={ false }
					/>
				) }
			</div>
		</h3>
	);
}
