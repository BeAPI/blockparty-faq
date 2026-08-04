import { Accordion } from '@beapi/be-a11y';

// eslint-disable-next-line no-undef
const accordionConfig = beapiFaqBlock.accordionConfig;

/**
 * Initialize FAQ accordion instances.
 */
const init = () => {
	Accordion.init(
		'.wp-block-blockparty-faq:has(button.wp-block-blockparty-faq-trigger)',
		accordionConfig
	);

	Accordion.init( '.wp-block-blockparty-faq:has(button.faq__trigger)', {
		...accordionConfig,
		panelSelector: '.faq__panel',
		triggerSelector: '.faq__trigger',
	} );
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
