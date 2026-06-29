/**
 * WordPress dependencies
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS_SIMPLE = [ 'core/heading', 'core/paragraph' ];

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context = {},
} ) {
	const {
		question,
		isAccordion = true,
		headingLevel: savedHeadingLevel,
	} = attributes;
	const headingLevel =
		context[ 'blockparty/headingLevel' ] ?? savedHeadingLevel ?? 3;
	const HeadingTag = `h${ headingLevel }`;
	const blockProps = useBlockProps();

	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	useEffect( () => {
		if ( ! isAccordion && innerBlocks.length === 0 && question ) {
			const headingBlock = createBlock( 'core/heading', {
				level: 3,
				content: question,
			} );
			replaceInnerBlocks( clientId, [ headingBlock ] );
		} else if ( isAccordion && innerBlocks.length > 0 ) {
			const firstBlock = innerBlocks[ 0 ];
			let extractedContent = '';

			if ( firstBlock.name === 'core/heading' ) {
				extractedContent = firstBlock.attributes?.content || '';
			} else if ( firstBlock.name === 'core/paragraph' ) {
				extractedContent = firstBlock.attributes?.content || '';
			}

			if ( extractedContent && extractedContent !== question ) {
				setAttributes( { question: extractedContent } );
			}

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

	if ( ! isAccordion ) {
		return (
			<h3 { ...blockProps }>
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
			</h3>
		);
	}

	return (
		<HeadingTag { ...blockProps }>
			<RichText
				tagName="span"
				className="wp-block-blockparty-faq-trigger"
				value={ question }
				onChange={ ( content ) =>
					setAttributes( { question: content } )
				}
				placeholder={ __( 'Question…?', 'blockparty-faq' ) }
				allowedFormats={ [] }
			/>
		</HeadingTag>
	);
}
