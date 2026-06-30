/**
 * WordPress dependencies
 */
import {
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis -- ToggleGroupControl is not yet a stable export in @wordpress/components 27.
	__experimentalToggleGroupControl as ToggleGroupControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import {
	addCard,
	headingLevel2,
	headingLevel3,
	headingLevel4,
	headingLevel5,
	headingLevel6,
} from '@wordpress/icons';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useLayoutEffect } from '@wordpress/element';

const QUESTION_BLOCK = 'blockparty/faq-question';
const HEADING_LEVELS = [ 2, 3, 4, 5, 6 ];

const HEADING_LEVEL_ICONS = {
	2: headingLevel2,
	3: headingLevel3,
	4: headingLevel4,
	5: headingLevel5,
	6: headingLevel6,
};

function collectQuestionBlocks( blocks ) {
	return blocks.flatMap( ( block ) => {
		const questions = block.name === QUESTION_BLOCK ? [ block ] : [];

		return questions.concat(
			collectQuestionBlocks( block.innerBlocks || [] )
		);
	} );
}

function syncQuestionHeadingLevels(
	clientId,
	headingLevel,
	isAccordion,
	{ getBlocksByClientId, updateBlockAttributes }
) {
	if ( ! isAccordion ) {
		return;
	}

	const [ faqBlock ] = getBlocksByClientId( clientId );
	const questionBlocks = collectQuestionBlocks( faqBlock?.innerBlocks || [] );

	questionBlocks.forEach( ( block ) => {
		if ( block.attributes.headingLevel !== headingLevel ) {
			updateBlockAttributes( block.clientId, { headingLevel } );
		}
	} );
}

function useSyncQuestionHeadingLevels( clientId, headingLevel, isAccordion ) {
	const questionBlocks = useSelect(
		( select ) => {
			const { getBlocksByClientId } = select( blockEditorStore );
			const [ faqBlock ] = getBlocksByClientId( clientId );

			return collectQuestionBlocks( faqBlock?.innerBlocks || [] );
		},
		[ clientId ]
	);
	const { getBlocksByClientId } = useSelect(
		( select ) => select( blockEditorStore ),
		[]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	useLayoutEffect( () => {
		syncQuestionHeadingLevels( clientId, headingLevel, isAccordion, {
			getBlocksByClientId,
			updateBlockAttributes,
		} );
	}, [
		clientId,
		headingLevel,
		isAccordion,
		questionBlocks,
		getBlocksByClientId,
		updateBlockAttributes,
	] );
}

export default function Edit( { clientId, attributes, setAttributes } ) {
	const { isAccordion = true, headingLevel = 3 } = attributes;
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'blockparty/faq-item' ],
		template: [ [ 'blockparty/faq-item' ] ],
		templateLock: false,
	} );

	const { insertBlock, updateBlockAttributes } =
		useDispatch( blockEditorStore );
	const blockEditor = useSelect(
		( select ) => select( blockEditorStore ),
		[]
	);
	const { getBlocks, getBlocksByClientId } = blockEditor;

	useSyncQuestionHeadingLevels( clientId, headingLevel, isAccordion );

	// Synchronize isAccordion attribute to all child blocks
	useEffect( () => {
		const innerBlocks = getBlocks( clientId );
		innerBlocks.forEach( ( block ) => {
			if ( 'blockparty/faq-item' === block.name ) {
				const itemInnerBlocks = getBlocks( block.clientId );
				itemInnerBlocks.forEach( ( itemBlock ) => {
					if (
						( 'blockparty/faq-question' === itemBlock.name ||
							'blockparty/faq-answer' === itemBlock.name ) &&
						itemBlock.attributes.isAccordion !== isAccordion
					) {
						updateBlockAttributes( itemBlock.clientId, {
							isAccordion,
						} );
					}
				} );
			}
		} );
	}, [ isAccordion, clientId, getBlocks, updateBlockAttributes ] );

	const onAddItem = () => {
		const newItem = createBlock( 'blockparty/faq-item', {}, [
			createBlock( 'blockparty/faq-question', {
				isAccordion,
				headingLevel,
			} ),
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
				<PanelBody title={ __( 'Settings', 'blockparty-faq' ) }>
					<ToggleControl
						label={ __( 'Accordion behavior', 'blockparty-faq' ) }
						help={ __(
							'If enabled, the FAQ will be displayed as an accordion component.',
							'blockparty-faq'
						) }
						checked={ isAccordion }
						onChange={ ( value ) => {
							setAttributes( { isAccordion: value } );

							if ( value ) {
								syncQuestionHeadingLevels(
									clientId,
									headingLevel,
									true,
									{
										getBlocksByClientId,
										updateBlockAttributes,
									}
								);
							}
						} }
						__nextHasNoMarginBottom
					/>
					{ isAccordion && (
						<ToggleGroupControl
							label={ __(
								'Question heading level',
								'blockparty-faq'
							) }
							help={ __(
								'Define the heading level for each FAQ question.',
								'blockparty-faq'
							) }
							value={ headingLevel }
							isBlock
							__next40pxDefaultSize
							onChange={ ( value ) => {
								const newHeadingLevel = Number( value );

								setAttributes( {
									headingLevel: newHeadingLevel,
								} );
								syncQuestionHeadingLevels(
									clientId,
									newHeadingLevel,
									isAccordion,
									{
										getBlocksByClientId,
										updateBlockAttributes,
									}
								);
							} }
						>
							{ HEADING_LEVELS.map( ( level ) => (
								<ToggleGroupControlOptionIcon
									key={ level }
									value={ level }
									icon={ HEADING_LEVEL_ICONS[ level ] }
									label={ sprintf(
										/* translators: %d: heading level number (2–6). */
										__(
											'Heading level %d',
											'blockparty-faq'
										),
										level
									) }
								/>
							) ) }
						</ToggleGroupControl>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
