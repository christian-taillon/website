#!/usr/bin/env node

/**
 * Migration script to convert Jekyll markdown files to Contentlayer MDX format
 *
 * Transformations:
 * - Remove: layout, permalink (handled by routing)
 * - Add: date field (use current date if missing)
 * - Add: draft: false
 * - Add: tags: [] if missing
 * - Preserve: title, description (renamed to summary)
 * - Convert file extension: .md or .markdown → .mdx
 */

const fs = require('fs')
const path = require('path')

// Configuration
const SOURCE_DIR = path.join(__dirname, '../old-site/docs')
const TARGET_DIR = path.join(__dirname, '../data/blog')
const DEFAULT_DATE = '2025-11-20'

/**
 * Extract frontmatter and content from markdown file
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, content: content }
  }

  const [, frontmatterStr, body] = match
  const frontmatter = {}

  // Parse YAML frontmatter
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      frontmatter[key] = value
    }
  })

  return { frontmatter, content: body }
}

/**
 * Transform Jekyll frontmatter to Contentlayer format
 */
function transformFrontmatter(oldFrontmatter) {
  const newFrontmatter = {}

  // Preserve title
  if (oldFrontmatter.title) {
    newFrontmatter.title = oldFrontmatter.title
  }

  // Add date (use existing or default)
  newFrontmatter.date = oldFrontmatter.date || DEFAULT_DATE

  // Add tags (preserve if exists, otherwise empty array)
  if (oldFrontmatter.tags) {
    newFrontmatter.tags = oldFrontmatter.tags
  } else {
    newFrontmatter.tags = '[]'
  }

  // Add draft: false
  newFrontmatter.draft = 'false'

  // Rename description to summary
  if (oldFrontmatter.description) {
    newFrontmatter.summary = oldFrontmatter.description
  }

  // Ignore: layout, permalink (handled by Next.js routing)

  return newFrontmatter
}

/**
 * Serialize frontmatter to YAML string
 */
function serializeFrontmatter(frontmatter) {
  const lines = []

  for (const [key, value] of Object.entries(frontmatter)) {
    if (key === 'tags' && value === '[]') {
      lines.push(`${key}: []`)
    } else if (key === 'draft' && value === 'false') {
      lines.push(`${key}: false`)
    } else {
      // Quote string values
      lines.push(`${key}: '${value}'`)
    }
  }

  return '---\n' + lines.join('\n') + '\n---\n'
}

/**
 * Migrate a single file
 */
function migrateFile(filename) {
  const sourcePath = path.join(SOURCE_DIR, filename)
  const content = fs.readFileSync(sourcePath, 'utf8')

  // Parse original content
  const { frontmatter, content: body } = parseFrontmatter(content)

  // Transform frontmatter
  const newFrontmatter = transformFrontmatter(frontmatter)

  // Generate new content
  const newContent = serializeFrontmatter(newFrontmatter) + body

  // Determine target filename (convert .md/.markdown to .mdx)
  const targetFilename = filename.replace(/\.(md|markdown)$/, '.mdx')
  const targetPath = path.join(TARGET_DIR, targetFilename)

  // Write to target
  fs.writeFileSync(targetPath, newContent, 'utf8')

  console.log(`✓ Migrated: ${filename} → ${targetFilename}`)

  return {
    source: filename,
    target: targetFilename,
    frontmatter: newFrontmatter
  }
}

/**
 * Main migration function
 */
function migrate(filesToMigrate = null) {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true })
  }

  // Get list of files to migrate
  let files
  if (filesToMigrate) {
    files = filesToMigrate
  } else {
    // Get all .md and .markdown files from source
    files = fs.readdirSync(SOURCE_DIR)
      .filter(f => f.endsWith('.md') || f.endsWith('.markdown'))
  }

  console.log(`Migrating ${files.length} files...\n`)

  const results = []
  for (const file of files) {
    try {
      const result = migrateFile(file)
      results.push(result)
    } catch (err) {
      console.error(`✗ Error migrating ${file}:`, err.message)
    }
  }

  console.log(`\n✓ Successfully migrated ${results.length}/${files.length} files`)

  return results
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: node migrate-markdown.js <file1.md> <file2.md> ...')
    console.log('   or: node migrate-markdown.js --all')
    console.log('\nMigrate specific files from old-site/docs/ to data/blog/')
    process.exit(0)
  }

  if (args[0] === '--all') {
    migrate()
  } else {
    migrate(args)
  }
}

module.exports = { migrate, migrateFile, transformFrontmatter, parseFrontmatter }
