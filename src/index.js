import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'blockparty/faq', {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
