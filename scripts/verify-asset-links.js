#!/usr/bin/env node

/**
 * Asset Link Verification Script
 *
 * This script scans all MDX files for asset references and verifies:
 * 1. Old Jekyll paths (/image/, /download/, /video/) that need updating
 * 2. New Next.js paths (/static/images/, /static/download/, /static/video/)
 * 3. Whether referenced assets actually exist in the filesystem
 *
 * Usage: node scripts/verify-asset-links.js
 */

const fs = require('fs')
const path = require('path')

// Configuration
const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

// Asset path patterns to search for
const ASSET_PATTERNS = {
  oldImage: /[("']\/image\/([^)"']+)[)"']/g,
  oldDownload: /[("']\/download\/([^)"']+)[)"']/g,
  oldVideo: /[("']\/video\/([^)"']+)[)"']/g,
  newImage: /[("']\/static\/images\/([^)"']+)[)"']/g,
  newDownload: /[("']\/static\/download\/([^)"']+)[)"']/g,
  newVideo: /[("']\/static\/video\/([^)"']+)[)"']/g,
}

// Results tracking
const results = {
  oldPaths: [],
  newPaths: [],
  brokenLinks: [],
  filesScanned: 0,
}

/**
 * Get all MDX files recursively
 */
function getMdxFiles(dir) {
  const files = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getMdxFiles(fullPath))
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Check if an asset file exists
 */
function assetExists(assetPath) {
  const fullPath = path.join(PUBLIC_DIR, assetPath)
  return fs.existsSync(fullPath)
}

/**
 * Scan a file for asset references
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const relativePath = path.relative(process.cwd(), filePath)

  // Check for old Jekyll paths
  for (const [patternName, pattern] of Object.entries(ASSET_PATTERNS)) {
    const matches = [...content.matchAll(pattern)]

    for (const match of matches) {
      const assetPath = match[1]
      const fullMatch = match[0]

      if (patternName.startsWith('old')) {
        // Old path found - needs migration
        const type = patternName.replace('old', '').toLowerCase()
        // Map to actual directory names: image->images, download->download, video->video
        const dirName = type === 'image' ? 'images' : type
        const newPath = `/static/${dirName}/${assetPath}`

        results.oldPaths.push({
          file: relativePath,
          oldPath: fullMatch,
          assetName: assetPath,
          suggestedPath: newPath,
          exists: assetExists(newPath.replace('/static/', '')),
        })
      } else {
        // New path - verify it exists
        const type = patternName.replace('new', '').toLowerCase()
        // Map to actual directory names: image->images, download->download, video->video
        const dirName = type === 'image' ? 'images' : type
        const staticPath = `static/${dirName}/${assetPath}`
        const exists = assetExists(staticPath)

        results.newPaths.push({
          file: relativePath,
          path: fullMatch,
          assetName: assetPath,
          exists,
        })

        if (!exists) {
          results.brokenLinks.push({
            file: relativePath,
            path: fullMatch,
            assetName: assetPath,
            expectedLocation: path.join(PUBLIC_DIR, staticPath),
          })
        }
      }
    }
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80))
  console.log('ASSET LINK VERIFICATION REPORT')
  console.log('='.repeat(80) + '\n')

  console.log(`📊 Files Scanned: ${results.filesScanned}\n`)

  // Old paths that need migration
  if (results.oldPaths.length > 0) {
    console.log('🔄 OLD PATHS NEEDING MIGRATION:')
    console.log('-'.repeat(80))

    const byFile = {}
    results.oldPaths.forEach((item) => {
      if (!byFile[item.file]) byFile[item.file] = []
      byFile[item.file].push(item)
    })

    for (const [file, items] of Object.entries(byFile)) {
      console.log(`\n📄 ${file}`)
      items.forEach((item) => {
        const status = item.exists ? '✅' : '❌'
        console.log(`   ${status} ${item.oldPath}`)
        console.log(`      → Suggested: ${item.suggestedPath}`)
        if (!item.exists) {
          console.log(`      ⚠️  Asset not found in public/static/`)
        }
      })
    }
    console.log(`\n📊 Total old paths found: ${results.oldPaths.length}`)
  } else {
    console.log('✅ NO OLD PATHS FOUND - All asset paths migrated!\n')
  }

  // New paths verification
  if (results.newPaths.length > 0) {
    console.log('\n✨ NEW PATHS VERIFIED:')
    console.log('-'.repeat(80))
    console.log(`Total new paths: ${results.newPaths.length}`)
    console.log(`Valid assets: ${results.newPaths.filter((p) => p.exists).length}`)
    console.log(`Broken links: ${results.brokenLinks.length}`)
  }

  // Broken links
  if (results.brokenLinks.length > 0) {
    console.log('\n❌ BROKEN LINKS FOUND:')
    console.log('-'.repeat(80))

    results.brokenLinks.forEach((item) => {
      console.log(`\n📄 ${item.file}`)
      console.log(`   Path: ${item.path}`)
      console.log(`   Expected: ${item.expectedLocation}`)
    })
    console.log(`\n📊 Total broken links: ${results.brokenLinks.length}`)
  } else if (results.newPaths.length > 0) {
    console.log('\n✅ NO BROKEN LINKS - All assets exist!\n')
  }

  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80))
  console.log(`Files scanned: ${results.filesScanned}`)
  console.log(`Old paths to migrate: ${results.oldPaths.length}`)
  console.log(`New paths verified: ${results.newPaths.length}`)
  console.log(`Broken links: ${results.brokenLinks.length}`)
  console.log('='.repeat(80) + '\n')

  // Exit code
  if (results.brokenLinks.length > 0) {
    console.log('⚠️  Warning: Broken links found!')
    process.exit(1)
  } else if (results.oldPaths.length > 0) {
    console.log('ℹ️  Info: Old paths found that should be migrated')
    process.exit(0)
  } else {
    console.log('✅ All asset links verified successfully!')
    process.exit(0)
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning MDX files for asset references...\n')

  const mdxFiles = getMdxFiles(BLOG_DIR)
  results.filesScanned = mdxFiles.length

  console.log(`Found ${mdxFiles.length} MDX files to scan\n`)

  mdxFiles.forEach((file) => {
    scanFile(file)
  })

  generateReport()
}

// Run the script
main()
