=== Blockparty FAQ ===
Contributors:      beapi
Tags:              block, faq, accordion, gutenberg, schema, seo, accessibility
Requires at least: 6.2
Tested up to:      6.8
Requires PHP:      8.1
Stable tag:        2.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A Gutenberg FAQ block with accessible accordion behavior and SEO-friendly structured data.

== Description ==

Blockparty FAQ provides a nested Gutenberg block for building frequently asked questions pages. Each FAQ entry is composed of a question and a rich-text answer that can contain any supported inner blocks (paragraphs, lists, images, buttons, and more).

**Key features:**

* Accessible accordion on the front end, powered by `@beapi/be-a11y`.
* Toggle between accordion and static display modes.
* Configurable question heading level (h2–h6).
* Nested block architecture: FAQ → FAQ Item → Question + Answer.
* FAQPage structured data (JSON-LD) via Yoast SEO, Rank Math, or SEOPress.
* Automatic migration from the legacy single-block format (pre-2.0).
* Full editor internationalization (JavaScript JSON translations and PHP PO/MO files).

**SEO plugins**

FAQ structured data requires one of the following SEO plugins to be active:

* Yoast SEO
* Rank Math
* SEOPress

Only one SEO plugin should be active at a time. The plugin automatically detects which one is available and outputs the appropriate schema.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/blockparty-faq` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Install and activate Yoast SEO, Rank Math, or SEOPress if you need FAQ structured data output.
4. Insert the **FAQ** block from the block inserter in the WordPress editor.

== Frequently Asked Questions ==

= Does this block work without an SEO plugin? =

Yes. The FAQ block renders correctly on the front end without any SEO plugin. Structured data (JSON-LD) output requires Yoast SEO, Rank Math, or SEOPress.

= Can I use multiple FAQ blocks on the same page? =

Yes. All FAQ blocks on a page are aggregated into a single FAQPage schema entry.

= Is the accordion accessible? =

Yes. The front-end accordion uses `@beapi/be-a11y` with proper ARIA attributes (`aria-expanded`, `role="region"`) and keyboard support.

== Changelog ==

= 2.1.0 - 2026-06-30 =
* Added configurable FAQ question heading level (h2–h6).
* Added Rank Math SEO integration for FAQ structured data.
* Added SEOPress integration for FAQ structured data.
* Added SEO service resolver to delegate schema output to the active SEO plugin.
* Added PSR-4 autoloading for plugin PHP classes.
* Added block inserter example preview for the FAQ block.
* Added deprecated save handlers for content saved in 2.0.x.
* Changed FAQ block markup to WordPress block class names (aligned with blockparty-accordion).
* Changed Yoast SEO integration into a dedicated service class.
* Changed wp-env npm scripts to `env:start` / `env:stop`.
* Fixed duplicate block wrapper in the FAQ item editor component.
* Fixed PSR-4 directory casing for Composer autoloading.
* Removed Psalm static analysis.

= 2.0.3 - 2026-02-17 =
* Added support for core/button blocks in FAQ answers.
* Added spacing support for FAQ answers.
* Added font size support for FAQ questions.
* Changed FAQ question text to strip HTML tags in structured data.

= 2.0.2 - 2026-01-27 =
* Fixed missing `isAccordion` attribute on the parent FAQ block.

= 2.0.1 - 2026-01-27 =
* Fixed block registration to use block metadata after the 2.0 build restructure.

= 2.0.0 - 2026-01-27 =
* Added nested block architecture (`faq-item`, `faq-question`, `faq-answer`).
* Added configurable accordion mode (`isAccordion` attribute).
* Added InnerBlocks support in FAQ answers and questions.
* Added front-end accordion script with `beapi_faq_block_config` filter.
* Added automatic migration from the legacy `questions` array format.
* Added add/remove FAQ item controls in the block editor.
* Added full internationalization (PO/MO and JSON translations).
* Added Yoast SEO FAQPage structured data integration.
* Changed build structure to one `block.json` per block directory.

= 1.0.2 - 2024-06-07 =
* Added PHP 8.2 to supported PHP versions.

= 1.0.1 - 2024-04-03 =
* Fixed CSS custom property variable names.

= 1.0.0 - 2024-04-02 =
* Initial release with accessible accordion and Yoast SEO FAQPage structured data.

== Upgrade Notice ==

= 2.1.0 =
Adds Rank Math and SEOPress support, configurable question heading levels, and updated block markup. Existing content is preserved via deprecated save handlers.

= 2.0.0 =
Major block architecture change. Existing FAQ blocks are automatically migrated to the new nested format on save.
