/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { listItem } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';

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

	/**
	 * @see ./deprecated.js
	 */
	deprecated,
	icon: listItem,
} );
