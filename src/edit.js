/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import FaqList from './FaqList';

export default function Edit( { attributes, setAttributes } ) {
	const { questions } = attributes;
	return (
		<div { ...useBlockProps() }>
			<div className="faq__accordion">
				<FaqList
					questions={ questions }
					onChange={ ( content ) =>
						setAttributes( { questions: content } )
					}
				/>
			</div>
		</div>
	);
}
