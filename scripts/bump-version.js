#!/usr/bin/env node
/**
 * Bump the plugin version across package, block metadata, PHP, and docs.
 *
 * Usage:
 *   npm run bump -- patch
 *   npm run bump -- minor
 *   npm run bump -- major
 *   npm run bump -- 2.2.0
 *
 * @package blockparty-faq
 */

const fs = require( 'fs' );
const path = require( 'path' );

const ROOT = path.resolve( __dirname, '..' );

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/;

/**
 * Resolve the absolute path of a project-relative file.
 *
 * @param {string} relativePath Relative path from the project root.
 * @return {string} Absolute file path.
 */
const resolvePath = ( relativePath ) => path.join( ROOT, relativePath );

/**
 * Read a UTF-8 file from the project root.
 *
 * @param {string} relativePath Relative path from the project root.
 * @return {string} File contents.
 */
const readFile = ( relativePath ) =>
	fs.readFileSync( resolvePath( relativePath ), 'utf8' );

/**
 * Write a UTF-8 file to the project root.
 *
 * @param {string} relativePath Relative path from the project root.
 * @param {string} contents     File contents.
 * @return {void}
 */
const writeFile = ( relativePath, contents ) => {
	fs.writeFileSync( resolvePath( relativePath ), contents, 'utf8' );
};

/**
 * Parse a JSON file from the project root.
 *
 * @param {string} relativePath Relative path from the project root.
 * @return {Object} Parsed JSON object.
 */
const readJson = ( relativePath ) => JSON.parse( readFile( relativePath ) );

/**
 * Write a JSON file with tab indentation (project convention).
 *
 * @param {string} relativePath Relative path from the project root.
 * @param {Object} data         Data to serialize.
 * @return {void}
 */
const writeJson = ( relativePath, data ) => {
	writeFile( relativePath, `${ JSON.stringify( data, null, '\t' ) }\n` );
};

/**
 * Print usage help and exit.
 *
 * @param {number} exitCode Process exit code.
 * @return {void}
 */
const printUsage = ( exitCode = 1 ) => {
	console.error( `
Usage:
  npm run bump -- <patch|minor|major|x.y.z>

Examples:
  npm run bump -- patch
  npm run bump -- minor
  npm run bump -- 2.2.0
`.trim() );
	process.exit( exitCode );
};

/**
 * Compute the next semantic version.
 *
 * @param {string} current Current version (x.y.z).
 * @param {string} bump    Bump type or explicit version.
 * @return {string} Next version.
 */
const getNextVersion = ( current, bump ) => {
	if ( SEMVER_RE.test( bump ) ) {
		return bump;
	}

	const match = current.match( SEMVER_RE );
	if ( ! match ) {
		throw new Error( `Invalid current version: ${ current }` );
	}

	let major = Number( match[ 1 ] );
	let minor = Number( match[ 2 ] );
	let patch = Number( match[ 3 ] );

	switch ( bump ) {
		case 'major':
			major += 1;
			minor = 0;
			patch = 0;
			break;
		case 'minor':
			minor += 1;
			patch = 0;
			break;
		case 'patch':
			patch += 1;
			break;
		default:
			throw new Error(
				`Unknown bump type "${ bump }". Use patch, minor, major, or x.y.z.`
			);
	}

	return `${ major }.${ minor }.${ patch }`;
};

/**
 * Format today's date as YYYY-MM-DD (local timezone).
 *
 * @return {string} ISO date string without time.
 */
const today = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String( now.getMonth() + 1 ).padStart( 2, '0' );
	const day = String( now.getDate() ).padStart( 2, '0' );
	return `${ year }-${ month }-${ day }`;
};

/**
 * Replace the first occurrence of a pattern or throw.
 *
 * @param {string}        contents File contents.
 * @param {RegExp|string} search   Search pattern.
 * @param {string}        replace  Replacement.
 * @param {string}        label    Human-readable label for errors.
 * @return {string} Updated contents.
 */
const replaceOnce = ( contents, search, replace, label ) => {
	if ( typeof search === 'string' ) {
		if ( ! contents.includes( search ) ) {
			throw new Error( `Could not find ${ label }.` );
		}
		return contents.replace( search, replace );
	}

	if ( ! search.test( contents ) ) {
		throw new Error( `Could not find ${ label }.` );
	}

	return contents.replace( search, replace );
};

/**
 * Update version fields in a JSON file that has a top-level "version" key.
 *
 * @param {string} relativePath Relative path from the project root.
 * @param {string} version      New version.
 * @return {void}
 */
const updateJsonVersion = ( relativePath, version ) => {
	const data = readJson( relativePath );
	if ( typeof data.version !== 'string' ) {
		throw new Error( `Missing "version" in ${ relativePath }.` );
	}
	data.version = version;
	writeJson( relativePath, data );
};

/**
 * Update package-lock.json root package version fields.
 *
 * @param {string} version New version.
 * @return {void}
 */
const updatePackageLock = ( version ) => {
	const lockPath = 'package-lock.json';
	if ( ! fs.existsSync( resolvePath( lockPath ) ) ) {
		return;
	}

	const lock = readJson( lockPath );
	lock.version = version;
	if ( lock.packages && lock.packages[ '' ] ) {
		lock.packages[ '' ].version = version;
	}
	writeJson( lockPath, lock );
};

/**
 * Update version strings in the main plugin PHP file.
 *
 * @param {string} currentVersion Current version.
 * @param {string} nextVersion    New version.
 * @return {void}
 */
const updatePluginPhp = ( currentVersion, nextVersion ) => {
	const relativePath = 'blockparty-faq.php';
	let contents = readFile( relativePath );

	contents = replaceOnce(
		contents,
		new RegExp(
			`( \\* Version:\\s+)${ escapeRegExp( currentVersion ) }`
		),
		`$1${ nextVersion }`,
		`plugin header Version in ${ relativePath }`
	);

	contents = replaceOnce(
		contents,
		`define( 'BLOCKPARTY_FAQ_VERSION', '${ currentVersion }' );`,
		`define( 'BLOCKPARTY_FAQ_VERSION', '${ nextVersion }' );`,
		`BLOCKPARTY_FAQ_VERSION in ${ relativePath }`
	);

	writeFile( relativePath, contents );
};

/**
 * Escape a string for safe use inside a RegExp.
 *
 * @param {string} value Raw string.
 * @return {string} Escaped string.
 */
const escapeRegExp = ( value ) =>
	value.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );

/**
 * Update Stable tag and changelog stubs in readme.txt.
 *
 * @param {string} currentVersion Current version.
 * @param {string} nextVersion    New version.
 * @param {string} date           Release date (YYYY-MM-DD).
 * @return {void}
 */
const updateReadmeTxt = ( currentVersion, nextVersion, date ) => {
	const relativePath = 'readme.txt';
	let contents = readFile( relativePath );

	contents = replaceOnce(
		contents,
		new RegExp(
			`(Stable tag:\\s+)${ escapeRegExp( currentVersion ) }`
		),
		`$1${ nextVersion }`,
		`Stable tag in ${ relativePath }`
	);

	const changelogStub = `= ${ nextVersion } - ${ date } =\n* TBD\n\n`;
	contents = replaceOnce(
		contents,
		`= ${ currentVersion }`,
		`${ changelogStub }= ${ currentVersion }`,
		`changelog section in ${ relativePath }`
	);

	const upgradeStub = `= ${ nextVersion } =\nTBD\n\n`;
	contents = replaceOnce(
		contents,
		'== Upgrade Notice ==\n\n',
		`== Upgrade Notice ==\n\n${ upgradeStub }`,
		`Upgrade Notice in ${ relativePath }`
	);

	writeFile( relativePath, contents );
};

/**
 * Prepend a Keep a Changelog stub in CHANGELOG.md.
 *
 * @param {string} nextVersion New version.
 * @param {string} date        Release date (YYYY-MM-DD).
 * @return {void}
 */
const updateChangelogMd = ( nextVersion, date ) => {
	const relativePath = 'CHANGELOG.md';
	let contents = readFile( relativePath );

	if ( contents.includes( `## [${ nextVersion }]` ) ) {
		throw new Error(
			`CHANGELOG.md already contains an entry for ${ nextVersion }.`
		);
	}

	const stub = `## [${ nextVersion }] - ${ date }

### Changed

- TBD

`;

	contents = replaceOnce(
		contents,
		'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n',
		`and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n${ stub }`,
		`Semantic Versioning intro in ${ relativePath }`
	);

	writeFile( relativePath, contents );
};

/**
 * Main entry point.
 *
 * @return {void}
 */
const main = () => {
	const bumpArg = process.argv[ 2 ];

	if ( ! bumpArg || bumpArg === '-h' || bumpArg === '--help' ) {
		printUsage( bumpArg ? 0 : 1 );
	}

	const pluginData = readJson( '.plugin-data' );
	const packageJson = readJson( 'package.json' );

	const currentVersion = pluginData.version || packageJson.version;
	if ( ! SEMVER_RE.test( currentVersion ) ) {
		throw new Error( `Invalid current version: ${ currentVersion }` );
	}

	const nextVersion = getNextVersion( currentVersion, bumpArg );
	if ( nextVersion === currentVersion ) {
		throw new Error(
			`Next version ${ nextVersion } is identical to the current version.`
		);
	}

	const date = today();
	const updated = [];

	updateJsonVersion( '.plugin-data', nextVersion );
	updated.push( '.plugin-data' );

	updateJsonVersion( 'package.json', nextVersion );
	updated.push( 'package.json' );

	updatePackageLock( nextVersion );
	if ( fs.existsSync( resolvePath( 'package-lock.json' ) ) ) {
		updated.push( 'package-lock.json' );
	}

	const blockJsonFiles = [
		'src/faq/block.json',
		'src/faq-answer/block.json',
		'src/faq-item/block.json',
		'src/faq-question/block.json',
	];

	blockJsonFiles.forEach( ( file ) => {
		updateJsonVersion( file, nextVersion );
		updated.push( file );
	} );

	updatePluginPhp( currentVersion, nextVersion );
	updated.push( 'blockparty-faq.php' );

	updateReadmeTxt( currentVersion, nextVersion, date );
	updated.push( 'readme.txt' );

	updateChangelogMd( nextVersion, date );
	updated.push( 'CHANGELOG.md' );

	console.log( `Bumped version ${ currentVersion } → ${ nextVersion }` );
	console.log( 'Updated files:' );
	updated.forEach( ( file ) => console.log( `  - ${ file }` ) );
	console.log(
		'\nFill in the TBD changelog entries before releasing.'
	);
};

try {
	main();
} catch ( error ) {
	console.error( `Error: ${ error.message }` );
	process.exit( 1 );
}
