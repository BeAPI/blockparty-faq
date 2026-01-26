/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { RichText, InnerBlocks } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS_SIMPLE = [ 'core/heading', 'core/paragraph' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { question, isAccordion = true } = attributes;
	const blockProps = useBlockProps( {
		className: 'faq__title',
	} );

	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	// When isAccordion changes from true to false and innerBlocks are empty,
	// create a core/heading block with the question attribute value
	// When isAccordion changes from false to true, remove innerBlocks and
	// transfer their content to the question attribute
	useEffect( () => {
		if ( ! isAccordion && innerBlocks.length === 0 && question ) {
			// Switch from accordion to non-accordion: create heading block
			const headingBlock = createBlock( 'core/heading', {
				level: 3,
				content: question,
			} );
			replaceInnerBlocks( clientId, [ headingBlock ] );
		} else if ( isAccordion && innerBlocks.length > 0 ) {
			// Switch from non-accordion to accordion: extract content from innerBlocks
			// Get the text content from the first block (usually a heading or paragraph)
			const firstBlock = innerBlocks[ 0 ];
			let extractedContent = '';

			if ( firstBlock.name === 'core/heading' ) {
				extractedContent = firstBlock.attributes?.content || '';
			} else if ( firstBlock.name === 'core/paragraph' ) {
				extractedContent = firstBlock.attributes?.content || '';
			}

			// Update the question attribute with the extracted content
			if ( extractedContent && extractedContent !== question ) {
				setAttributes( { question: extractedContent } );
			}

			// Remove innerBlocks
			replaceInnerBlocks( clientId, [] );
		}
	}, [
		isAccordion,
		innerBlocks,
		question,
		clientId,
		replaceInnerBlocks,
		setAttributes,
	] );

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
								'core/heading',
								{
									level: 3,
									placeholder: __(
										'Question…?',
										'blockparty-faq'
									),
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
