#!/usr/bin/env node

/**
 * Audit script to verify MDX content files
 *
 * Checks:
 * - Frontmatter format is correct
 * - Required fields present (title, date, tags, draft)
 * - Old paths (/image/, /download/)
 */

const fs = require('fs')
const path = require('path')

const BLOG_DIR = path.join(__dirname, '../data/blog')

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: null, content: content }
  }

  const [, frontmatterStr, body] = match
  const frontmatter = {}

  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()

      frontmatter[key] = value
    }
  })

  return { frontmatter, content: body }
}

function auditFile(filename) {
  const filePath = path.join(BLOG_DIR, filename)
  const content = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, content: body } = parseFrontmatter(content)

  const issues = []

  // Check if frontmatter exists
  if (!frontmatter) {
    issues.push('No frontmatter found')
    return { filename, issues, status: 'ERROR' }
  }

  // Check required fields
  if (!frontmatter.title) issues.push('Missing title')
  if (!frontmatter.date) issues.push('Missing date')
  if (!frontmatter.tags) issues.push('Missing tags')
  if (!frontmatter.draft) issues.push('Missing draft field')

  // Check for old Jekyll fields (should be removed)
  if (frontmatter.layout) issues.push('Has old layout field (should be removed)')
  if (frontmatter.permalink) issues.push('Has old permalink field (should be removed)')

  // Check for old paths in content
  const oldImagePath = body.match(/(?:src|href)=["']\/image\//g)
  if (oldImagePath) {
    issues.push(`Found ${oldImagePath.length} old /image/ path(s)`)
  }

  const oldImageMarkdown = body.match(/!\[.*?\]\(\/image\//g)
  if (oldImageMarkdown) {
    issues.push(`Found ${oldImageMarkdown.length} old markdown image(s) with /image/`)
  }

  const oldDownloadPath = body.match(/href=["']\/download\//g)
  if (oldDownloadPath) {
    issues.push(`Found ${oldDownloadPath.length} old /download/ path(s)`)
  }

  const oldDownloadMarkdown = body.match(/\]\(\/download\//g)
  if (oldDownloadMarkdown) {
    issues.push(`Found ${oldDownloadMarkdown.length} old markdown link(s) with /download/`)
  }

  const status = issues.length === 0 ? 'OK' : 'ISSUES'
  return { filename, issues, status, frontmatter }
}

function audit() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .sort()

  console.log(`Auditing ${files.length} MDX files...\n`)
  console.log('='.repeat(80))

  const results = {
    ok: [],
    issues: [],
    errors: []
  }

  for (const file of files) {
    try {
      const result = auditFile(file)

      if (result.status === 'OK') {
        results.ok.push(result)
        console.log(`✓ ${file}`)
      } else if (result.status === 'ERROR') {
        results.errors.push(result)
        console.log(`✗ ${file}`)
        result.issues.forEach(issue => console.log(`  - ${issue}`))
      } else {
        results.issues.push(result)
        console.log(`⚠ ${file}`)
        result.issues.forEach(issue => console.log(`  - ${issue}`))
      }
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`)
      results.errors.push({ filename: file, issues: [err.message], status: 'ERROR' })
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('\nSUMMARY:')
  console.log(`✓ OK: ${results.ok.length}`)
  console.log(`⚠ Issues: ${results.issues.length}`)
  console.log(`✗ Errors: ${results.errors.length}`)
  console.log(`Total: ${files.length}`)

  if (results.issues.length > 0 || results.errors.length > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('\nFILES NEEDING ATTENTION:')

    if (results.errors.length > 0) {
      console.log('\nERRORS:')
      results.errors.forEach(r => {
        console.log(`\n${r.filename}:`)
        r.issues.forEach(issue => console.log(`  - ${issue}`))
      })
    }

    if (results.issues.length > 0) {
      console.log('\nISSUES:')
      results.issues.forEach(r => {
        console.log(`\n${r.filename}:`)
        r.issues.forEach(issue => console.log(`  - ${issue}`))
      })
    }
  }

  return results
}

// Run audit
if (require.main === module) {
  const results = audit()
  process.exit(results.errors.length > 0 ? 1 : 0)
}

module.exports = { audit, auditFile }
