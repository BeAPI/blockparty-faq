/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { help } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';

// Register child blocks first
import '../faq-item';

// Register parent block
registerBlockType( metadata.name, {
	...metadata,
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,

	icon: help,

	/**
	 * Migration from old format (questions array) to new format (InnerBlocks)
	 * @see ./deprecated.js
	 */
	deprecated,
} );
