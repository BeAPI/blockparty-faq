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

registerBlockType( 'blockparty/faq-question', {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
	icon: listItem,
} );
