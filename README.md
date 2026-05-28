# Blockparty FAQ

A Gutenberg block for SEO friendly FAQ in an accessible accordion.

## Development Setup

### Prerequisites

- Node.js 20.12.0 (managed by Volta)
- Docker (for wp-env)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the blocks:

   ```bash
   npm run build
   ```

4. Start the WordPress environment and install Yoast SEO:

   ```bash
   npm run setup:env
   ```

   **Note:** On Windows, you may need to run the commands separately:

   ```bash
   npm run start:env
   # Wait for WordPress to be ready (about 10-15 seconds)
   npm run setup
   ```

### Available Scripts

- `npm run build` - Build the blocks for production
- `npm run start` - Start the development server with hot reload
- `npm run start:env` - Start the WordPress environment (wp-env)
- `npm run stop:env` - Stop the WordPress environment
- `npm run install:yoast` - Install and activate Yoast SEO plugin (required for schema generation)
- `npm run setup:env` - Start wp-env and install Yoast SEO in one command

### Note

Yoast SEO is required for the FAQ schema (JSON-LD) generation. It is installed automatically via `npm run setup:env` but is not versioned in the repository.

## Changelog

### 1.0.0 - 2024-04-02

- initial commit.

### 1.0.1 - 2024-04-03

- fix css variable names

### 1.0.2 - 2024-06-06

- Add support for PHP 8.2

### 2.0.0 - 2026-01-26

- **Major block structure refactoring** : Transition from a monolithic block to a nested architecture with child blocks (`faq-item`, `faq-question`, `faq-answer`)
- **Configurable accordion mode** : Added `isAccordion` attribute allowing to toggle between an interactive accordion mode and a static mode
- **InnerBlocks support in answers** : Ability to add any Gutenberg block (lists, paragraphs, images, etc.) in FAQ answers
- **Front-end JavaScript** : Added `script.js` to handle accordion interactivity on the front-end with customizable configuration via the `beapi_faq_block_config` filter
- **Automatic migration** : Migration system from the old format (`questions` array attribute) to the new format (InnerBlocks)
- **Complete internationalization** : Support for PO/MO translations for PHP and JSON for JavaScript
- **Aligned build structure** : Reorganization to follow the `blockparty-accordion` model with `block.json` in each block directory
- **Add/remove buttons** : Added buttons to add and remove FAQ items directly from the editor

### 2.0.1 - 2026-01-27

- Fix build blocks

### 2.0.2 - 2026-01-27

- Add missing isAccordion attribute

### 2.0.3 - 2026-02-17

- Allow adding "Button" blocks in the answer content
- Add spacing support for answers
- Add font size support for the question
- Strip HTML tags from the question in structured data

### 2.0.4 - 2026-05-28

- Add block example.