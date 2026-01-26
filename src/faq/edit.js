/**
 * WordPress dependencies
 */
import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import { addCard } from '@wordpress/icons';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

export default function Edit( { clientId, attributes, setAttributes } ) {
	const { isAccordion = true } = attributes;
	const blockProps = useBlockProps();

	const { insertBlock, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );
	const { getBlocks } = useSelect(
		( select ) => select( 'core/block-editor' ),
		[]
	);

	// Synchronize isAccordion attribute to all child blocks
	useEffect( () => {
		const innerBlocks = getBlocks( clientId );
		innerBlocks.forEach( ( block ) => {
			// Update faq-item blocks
			if ( 'blockparty/faq-item' === block.name ) {
				const itemInnerBlocks = getBlocks( block.clientId );
				itemInnerBlocks.forEach( ( itemBlock ) => {
					if (
						( 'blockparty/faq-question' === itemBlock.name ||
							'blockparty/faq-answer' === itemBlock.name ) &&
						itemBlock.attributes.isAccordion !== isAccordion
					) {
						updateBlockAttributes( itemBlock.clientId, {
							isAccordion: isAccordion,
						} );
					}
				} );
			}
		} );
	}, [ isAccordion, clientId, getBlocks, updateBlockAttributes ] );

	const onAddItem = () => {
		const newItem = createBlock( 'blockparty/faq-item', {}, [
			createBlock( 'blockparty/faq-question', { isAccordion } ),
			createBlock( 'blockparty/faq-answer', { isAccordion } ),
		] );
		insertBlock( newItem, undefined, clientId );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ addCard }
						label={ __( 'Add FAQ item', 'blockparty-faq' ) }
						onClick={ onAddItem }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'FAQ Settings', 'blockparty-faq' ) }>
					<ToggleControl
						label={ __( 'Accordion behavior', 'blockparty-faq' ) }
						help={ __(
							'If enabled, the HTML structure will be interpreted as an accordion from screen readers.',
							'blockparty-faq'
						) }
						checked={ isAccordion }
						onChange={ ( value ) =>
							setAttributes( { isAccordion: value } )
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="faq__accordion">
					<InnerBlocks
						allowedBlocks={ [ 'blockparty/faq-item' ] }
						template={ [ [ 'blockparty/faq-item' ] ] }
						templateLock={ false }
					/>
				</div>
			</div>
		</>
	);
}
