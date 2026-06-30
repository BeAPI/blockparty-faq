# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-06-30

### Added

- Configurable FAQ question heading level (h2–h6) from the block settings panel.
- Rank Math SEO integration for FAQ structured data (JSON-LD).
- SEOPress integration for FAQ structured data (JSON-LD).
- SEO service resolver to delegate schema output to the active SEO plugin (Yoast SEO, Rank Math, or SEOPress).
- PSR-4 autoloading for plugin PHP classes via Composer.
- Block example in the FAQ block inserter preview.
- Deprecated save handlers to preserve front-end markup for content saved in 2.0.x.

### Changed

- Refactored FAQ block markup to use WordPress block class names (aligned with blockparty-accordion).
- Refactored Yoast SEO integration into a dedicated service class alongside other SEO plugins.
- Updated French translations for all block editor scripts.
- Replaced wp-env npm scripts (`start:env` / `stop:env` / `setup:env`) with `env:start` / `env:stop`.
- Local development environment now mounts Yoast SEO, Rank Math, and SEOPress via Composer.

### Fixed

- Removed duplicate block wrapper in the FAQ item editor component (`useBlockProps` called twice).
- Renamed `includes/` subdirectories to match PSR-4 namespace casing (`Schema/`, `Services/`, `Hooks/`).

### Removed

- Psalm static analysis configuration and dependency.

## [2.0.3] - 2026-02-17

### Added

- Support for core/button blocks inside FAQ answers.
- Spacing support for FAQ answers.
- Font size (typography) support for FAQ questions.

### Changed

- FAQ question text is stripped of HTML tags in structured data output.

## [2.0.2] - 2026-01-27

### Fixed

- Added missing `isAccordion` attribute to the parent FAQ block.

## [2.0.1] - 2026-01-27

### Fixed

- Block registration now uses block metadata from `block.json` correctly after the 2.0 build restructure.

## [2.0.0] - 2026-01-27

### Added

- Nested block architecture with child blocks: `faq-item`, `faq-question`, and `faq-answer`.
- Configurable accordion mode via the `isAccordion` attribute (interactive accordion or static layout).
- InnerBlocks support in FAQ answers (paragraphs, lists, images, and other Gutenberg blocks).
- InnerBlocks support in FAQ questions when accordion mode is disabled.
- Front-end accordion script with configurable behavior via the `beapi_faq_block_config` filter.
- Automatic migration from the legacy `questions` array attribute to the InnerBlocks format.
- Add and remove FAQ item controls in the block editor toolbar.
- Full internationalization: PO/MO translations for PHP and JSON translations for JavaScript.
- Yoast SEO FAQPage structured data integration.
- wp-env local development environment.

### Changed

- Build structure reorganized to follow the blockparty-accordion model (one `block.json` per block directory).

## [1.0.2] - 2024-06-07

### Changed

- Added PHP 8.2 to supported PHP versions.

## [1.0.1] - 2024-04-03

### Fixed

- Corrected CSS custom property variable names.

## [1.0.0] - 2024-04-02

### Added

- Initial release of the Blockparty FAQ Gutenberg block.
- Accessible accordion front-end behavior powered by `@beapi/be-a11y`.
- Yoast SEO FAQPage structured data (JSON-LD) generation.
- Editor controls to add and remove FAQ items.

[2.1.0]: https://github.com/BeAPI/blockparty-faq/compare/2.0.3...2.1.0
[2.0.3]: https://github.com/BeAPI/blockparty-faq/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/BeAPI/blockparty-faq/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/BeAPI/blockparty-faq/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/BeAPI/blockparty-faq/compare/1.0.2...2.0.0
[1.0.2]: https://github.com/BeAPI/blockparty-faq/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/BeAPI/blockparty-faq/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/BeAPI/blockparty-faq/releases/tag/1.0.0
