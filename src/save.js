import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	return (
		<div { ...useBlockProps.save() }>
			<div className="faq__accordion">
				{ attributes.questions.map( ( item ) => (
					<div key={ item.id } className="faq__item">
						<h3 className="faq__title">
							<button
								className="faq__trigger"
								aria-expanded="false"
							>
								<RichText.Content
									tagName="span"
									value={ item.question }
								/>
							</button>
						</h3>
						<div className="faq__panel" role="region">
							<RichText.Content
								tagName="p"
								value={ item.answer }
							/>
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
}
