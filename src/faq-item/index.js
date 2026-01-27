/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { list } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'blockparty/faq-item', {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
	icon: list,
} );
