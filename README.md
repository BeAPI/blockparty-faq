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

4. Install PHP dependencies (downloads SEO plugins into `.wp-env/plugins/`):

   ```bash
   composer install
   ```

5. Start the WordPress environment:

   ```bash
   npm run env:start
   ```

   Yoast SEO, Rank Math, and SEOPress are mounted automatically via `.wp-env.json`.

### Available Scripts

- `npm run build` - Build the blocks for production
- `npm run start` - Start the development server with hot reload
- `npm run env:start` - Start the WordPress environment (wp-env)
- `npm run env:stop` - Stop the WordPress environment
- `npm run bump -- <patch|minor|major|x.y.z>` - Bump the plugin version across package, blocks, PHP, and docs

### Note

FAQ structured data (JSON-LD) requires Yoast SEO, Rank Math, or SEOPress. All three plugins are available in the local wp-env environment; keep only one active in the WordPress admin when testing a specific integration. SEO plugin files are not versioned in the repository (installed via Composer into `.wp-env/plugins/`).

## Workflow deployment

See the [release process](DEPLOYMENT.md). 

## Changelog

See [readme.txt](readme.txt) and [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

Developed with ❤️ by [Be API](https://beapi.fr)
