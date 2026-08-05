#!/usr/bin/env bash
#
# Bump the plugin version across package, block metadata, PHP, and docs.
#
# Usage (no chmod required):
#   bash bin/bump.sh patch
#   bash bin/bump.sh minor
#   bash bin/bump.sh major
#   bash bin/bump.sh 2.2.0
#   npm run bump -- patch
#   npm run bump -- 2.2.0
#
# macOS sed (-i '') is assumed.
#

set -euo pipefail

# ---------------------------------------------------------------------------
# Assets — add or remove paths here
# ---------------------------------------------------------------------------

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# JSON files that expose a top-level "version" field
JSON_VERSION_FILES=(
	".plugin-data"
	"package.json"
	"src/faq/block.json"
	"src/faq-answer/block.json"
	"src/faq-item/block.json"
	"src/faq-question/block.json"
)

PACKAGE_LOCK_FILE="package-lock.json"
PHP_FILE="blockparty-faq.php"
README_TXT="readme.txt"
CHANGELOG="CHANGELOG.md"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

UPDATED_FILES=()

log_updated() {
	UPDATED_FILES+=( "$1" )
}

require_file() {
	local file="$1"
	if [[ ! -f "${ROOT_DIR}/${file}" ]]; then
		echo "Error: Missing file ${file}" >&2
		exit 1
	fi
}

replace_json_version() {
	local file="$1"
	local path="${ROOT_DIR}/${file}"
	require_file "${file}"
	sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"${VERSION}\"/" "${path}"
	log_updated "${file}"
}

usage() {
	local code="${1:-0}"
	echo "Usage: bash bin/bump.sh <patch|minor|major|x.y.z>"
	echo ""
	echo "Examples:"
	echo "  bash bin/bump.sh patch"
	echo "  bash bin/bump.sh minor"
	echo "  bash bin/bump.sh 2.2.0"
	echo "  npm run bump -- patch"
	exit "${code}"
}

resolve_version() {
	local current="$1"
	local input="$2"

	if [[ "${input}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
		echo "${input}"
		return
	fi

	local major minor patch
	IFS='.' read -r major minor patch <<< "${current}"

	case "${input}" in
		major)
			echo "$((major + 1)).0.0"
			;;
		minor)
			echo "${major}.$((minor + 1)).0"
			;;
		patch)
			echo "${major}.${minor}.$((patch + 1))"
			;;
		*)
			echo "Error: Unknown bump argument \"${input}\". Use patch, minor, major, or an explicit x.y.z version." >&2
			exit 1
			;;
	esac
}

escape_sed() {
	printf '%s\n' "$1" | sed -e 's/[.[\*^$\/]/\\&/g'
}

# ---------------------------------------------------------------------------
# Args
# ---------------------------------------------------------------------------

if [[ -z "${1:-}" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
	usage "$([[ -n "${1:-}" ]] && echo 0 || echo 1)"
fi

INPUT="$1"

require_file ".plugin-data"
CURRENT="$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([0-9]*\.[0-9]*\.[0-9]*\)".*/\1/p' "${ROOT_DIR}/.plugin-data" | head -n 1)"

if [[ -z "${CURRENT}" ]]; then
	echo "Error: Could not read current version from .plugin-data" >&2
	exit 1
fi

if ! [[ "${CURRENT}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
	echo "Error: Invalid current version \"${CURRENT}\" in .plugin-data" >&2
	exit 1
fi

VERSION="$(resolve_version "${CURRENT}" "${INPUT}")"

if [[ "${VERSION}" == "${CURRENT}" ]]; then
	echo "Error: Version is already ${CURRENT}" >&2
	exit 1
fi

echo "Bumping version: ${CURRENT} → ${VERSION}"
TODAY="$(date +%Y-%m-%d)"

# ---------------------------------------------------------------------------
# JSON version fields
# ---------------------------------------------------------------------------

for file in "${JSON_VERSION_FILES[@]}"; do
	replace_json_version "${file}"
done

# ---------------------------------------------------------------------------
# package-lock.json (root + packages[""] only)
# ---------------------------------------------------------------------------

if [[ -f "${ROOT_DIR}/${PACKAGE_LOCK_FILE}" ]]; then
	# Root "version" (near top of file)
	sed -i '' '1,5s/"version": "[0-9]*\.[0-9]*\.[0-9]*"/"version": "'"${VERSION}"'"/' "${ROOT_DIR}/${PACKAGE_LOCK_FILE}"
	# packages[""].version
	sed -i '' '6,12s/"version": "[0-9]*\.[0-9]*\.[0-9]*"/"version": "'"${VERSION}"'"/' "${ROOT_DIR}/${PACKAGE_LOCK_FILE}"
	log_updated "${PACKAGE_LOCK_FILE}"
fi

# ---------------------------------------------------------------------------
# Main plugin PHP
# ---------------------------------------------------------------------------

require_file "${PHP_FILE}"
sed -i '' "s/^\( \* Version:[[:space:]]*\)$(escape_sed "${CURRENT}")/\1${VERSION}/" "${ROOT_DIR}/${PHP_FILE}"
sed -i '' "s/define( 'BLOCKPARTY_FAQ_VERSION', '$(escape_sed "${CURRENT}")' )/define( 'BLOCKPARTY_FAQ_VERSION', '${VERSION}' )/" "${ROOT_DIR}/${PHP_FILE}"
log_updated "${PHP_FILE}"

# ---------------------------------------------------------------------------
# readme.txt — Stable tag + changelog + Upgrade Notice stubs
# ---------------------------------------------------------------------------

require_file "${README_TXT}"
sed -i '' "s/^\(Stable tag:[[:space:]]*\)$(escape_sed "${CURRENT}")/\1${VERSION}/" "${ROOT_DIR}/${README_TXT}"

if grep -q "^= ${VERSION} - " "${ROOT_DIR}/${README_TXT}"; then
	echo "Error: readme.txt already contains a changelog entry for ${VERSION}" >&2
	exit 1
fi

awk -v ver="${VERSION}" -v today="${TODAY}" -v current="${CURRENT}" '
	{
		if ( $0 ~ ("^= " current " - ") ) {
			print "= " ver " - " today " ="
			print "* TBD"
			print ""
		}
		print
	}
' "${ROOT_DIR}/${README_TXT}" > "${ROOT_DIR}/${README_TXT}.tmp"
mv "${ROOT_DIR}/${README_TXT}.tmp" "${ROOT_DIR}/${README_TXT}"

if grep -q "^= ${VERSION} =$" "${ROOT_DIR}/${README_TXT}"; then
	echo "Error: readme.txt already contains an Upgrade Notice for ${VERSION}" >&2
	exit 1
fi

awk -v ver="${VERSION}" '
	{
		print
		if ( $0 == "== Upgrade Notice ==" ) {
			getline
			print ""
			print "= " ver " ="
			print "TBD"
			print ""
			if ( $0 != "" ) {
				print
			}
		}
	}
' "${ROOT_DIR}/${README_TXT}" > "${ROOT_DIR}/${README_TXT}.tmp"
mv "${ROOT_DIR}/${README_TXT}.tmp" "${ROOT_DIR}/${README_TXT}"
log_updated "${README_TXT}"

# ---------------------------------------------------------------------------
# CHANGELOG.md — Keep a Changelog entry
# ---------------------------------------------------------------------------

require_file "${CHANGELOG}"

if grep -q "^## \[${VERSION}\]" "${ROOT_DIR}/${CHANGELOG}"; then
	echo "Error: CHANGELOG.md already contains an entry for ${VERSION}" >&2
	exit 1
fi

awk -v ver="${VERSION}" -v today="${TODAY}" '
	{
		print
		if ( !inserted && index( $0, "Semantic Versioning" ) ) {
			getline
			print ""
			print "## [" ver "] - " today
			print ""
			print "### Changed"
			print ""
			print "- TBD"
			print ""
			inserted = 1
			# Marker is followed by a blank line; skip the consumed blank.
			next
		}
	}
' "${ROOT_DIR}/${CHANGELOG}" > "${ROOT_DIR}/${CHANGELOG}.tmp"
mv "${ROOT_DIR}/${CHANGELOG}.tmp" "${ROOT_DIR}/${CHANGELOG}"
log_updated "${CHANGELOG}"

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo ""
echo "Bumped version ${CURRENT} → ${VERSION}"
echo "Updated files:"
for file in "${UPDATED_FILES[@]}"; do
	echo "  - ${file}"
done
echo ""
echo "Fill in the TBD changelog entries before releasing."
