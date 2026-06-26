/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { addCard, trash } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

export default function Edit( { clientId } ) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'blockparty/faq-question', 'blockparty/faq-answer' ],
		template: [
			[ 'blockparty/faq-question' ],
			[ 'blockparty/faq-answer' ],
		],
		templateLock: 'all',
	} );

	const { insertBlock, removeBlock } = useDispatch( 'core/block-editor' );
	const { getBlockRootClientId, getBlockIndex, getBlock } = useSelect(
		( select ) => select( 'core/block-editor' ),
		[]
	);

	const rootClientId = getBlockRootClientId( clientId );
	const blockIndex = getBlockIndex( clientId );

	const parentBlock = rootClientId ? getBlock( rootClientId ) : null;
	const isAccordion =
		parentBlock?.attributes?.isAccordion !== undefined
			? parentBlock.attributes.isAccordion
			: true;

	const onAddItem = () => {
		const newItem = createBlock( 'blockparty/faq-item', {}, [
			createBlock( 'blockparty/faq-question', { isAccordion } ),
			createBlock( 'blockparty/faq-answer', { isAccordion } ),
		] );
		insertBlock( newItem, blockIndex + 1, rootClientId );
	};

	const onRemoveItem = () => {
		removeBlock( clientId );
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
					<ToolbarButton
						icon={ trash }
						label={ __( 'Remove FAQ item', 'blockparty-faq' ) }
						onClick={ onRemoveItem }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...useBlockProps() }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
