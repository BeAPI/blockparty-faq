/**
 * External dependencies
 */
import { filter } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { chevronUp, chevronDown, trash, plusCircle } from '@wordpress/icons';
import { RichText } from '@wordpress/block-editor';

export default function FaqList( { questions, onChange } ) {
	const generateId = ( prefix ) => {
		return `${ prefix }-${ new Date().getTime() }`;
	};

	const arrayMove = ( init, target ) => {
		questions = [ ...questions ];
		const question = questions[ init ];
		questions[ init ] = questions[ target ];
		questions[ target ] = question;
		onChange( questions );
	};

	const onAddElement = () => {
		questions = [
			...questions,
			{
				id: generateId( 'faq' ),
				question: '',
				answer: '',
			},
		];
		onChange( questions );
	};
	const onRemoveElement = ( removedIndex ) => {
		questions = filter( questions, ( value, index ) => {
			return index !== removedIndex;
		} );
		onChange( questions );
	};

	const onMoveUpElement = ( index ) => {
		arrayMove( index, index - 1 );
	};

	const onMoveDownElement = ( index ) => {
		arrayMove( index, index + 1 );
	};

	const updateQuestion = ( id, question ) => {
		onChange(
			questions.map( ( el ) =>
				el.id === id ? { ...el, question } : el
			)
		);
	};

	const updateAnswer = ( id, answer ) => {
		onChange(
			questions.map( ( el ) => ( el.id === id ? { ...el, answer } : el ) )
		);
	};

	return (
		<>
			{ questions.map( ( item, index ) => (
				<div
					key={ item.id }
					className="faq__item faq-list__item"
					data-index={ index }
				>
					{ index !== 0 && (
						<Button
							icon={ chevronUp }
							className="faq-list__button"
							aria-hidden="true"
							label={ __( 'Move up FAQs', 'blockparty-faq' ) }
							// Should not be able to tab to drag handle as this
							// button can only be used with a pointer device.
							tabIndex="-1"
							onClick={ () => onMoveUpElement( index ) }
						/>
					) }
					{ index + 1 !== questions.length && (
						<Button
							icon={ chevronDown }
							className="faq-list__button"
							aria-hidden="true"
							label={ __( 'Move down FAQs', 'blockparty-faq' ) }
							// Should not be able to tab to drag handle as this
							// button can only be used with a pointer device.
							tabIndex="-1"
							onClick={ () => onMoveDownElement( index ) }
						/>
					) }
					<Button
						icon={ trash }
						iconSize={ 18 }
						className="faq-list__button"
						aria-hidden="true"
						label={ __( 'Remove FAQ', 'blockparty-faq' ) }
						// Should not be able to tab to drag handle as this
						// button can only be used with a pointer device.
						tabIndex="-1"
						onClick={ () => onRemoveElement( index ) }
					/>
					<h3 className="faq__title">
						<div className="faq__trigger">
							<RichText
								tagName="span" // The tag here is the element output and editable in the admin
								value={ item.question } // Any existing content, either from the database or an attribute default
								allowedFormats={ [] } // Allow the content to be made bold or italic, but do not allow other formatting options
								onChange={ ( content ) =>
									updateQuestion( item.id, content )
								} // Store updated content as a block attribute
								placeholder={ __(
									'Question…?',
									'blockparty-faq'
								) } // Display this text before any content has been added by the user
							/>
						</div>
					</h3>
					<div className="faq__panel">
						<RichText
							tagName="p" // The tag here is the element output and editable in the admin
							value={ item.answer } // Any existing content, either from the database or an attribute default
							onChange={ ( content ) =>
								updateAnswer( item.id, content )
							} // Store updated content as a block attribute
							placeholder={ __( 'Answer…', 'blockparty-faq' ) } // Display this text before any content has been added by the user
						/>
					</div>
				</div>
			) ) }
			<Button
				icon={ plusCircle }
				iconSize={ 18 }
				className="faq-list__add-item"
				label={ __( 'Add a question', 'blockparty-faq' ) }
				// Should not be able to tab to drag handle as this
				// button can only be used with a pointer device.
				tabIndex="-1"
				text={ __( 'Add a question', 'blockparty-faq' ) }
				onClick={ () => onAddElement() }
			/>
		</>
	);
}
