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

* initial commit.

### 1.0.1 - 2024-04-03

* fix css variable names

### 1.0.2 - 2024-06-06

* Add support for PHP 8.2
