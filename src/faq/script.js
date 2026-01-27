import { Accordion } from '@beapi/be-a11y';

// eslint-disable-next-line no-undef
const accordionConfig = beapiFaqBlock.accordionConfig;

// Initialize beapi-accordion
window.addEventListener( 'load', function () {
	Accordion.init(
		'.wp-block-blockparty-faq:has(button.faq__trigger)',
		accordionConfig
	);
} );
