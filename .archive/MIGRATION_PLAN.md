# Jekyll to Next.js Migration Plan
**Christian Taillon's Website Migration**

## Overview
Migrating from Jekyll (christian-taillon.github.io) to Next.js + Tailwind + Contentlayer framework.

### Current Status
- **Old Site**: 43 markdown files in `/old-site/docs/`, Jekyll-based
- **New Site**: 44 MDX files in `/data/blog/` (includes 10 template files to remove)
- **Framework**: Next.js 15.2.4, React 19, Tailwind CSS 4.0, Contentlayer
- **Strategy**: Keep it simple - maintain markdown→content workflow

### Migration Statistics
- ✅ Content migrated: 34 files (79%)
- ❌ Missing content: 9 files (21%)
- 🗑️ Template files to remove: 10 files
- 📄 Special pages to migrate: 3 (resume, agentic-soc, dns-osint)

---

## SECTION A: Content Migration & Cleanup
**Agent Focus**: Files in `/data/blog/` and migration scripts
**Dependencies**: None - can start immediately
**Priority**: HIGH

### Tasks

#### 1. Remove Template Files (10 files)
Delete these Next.js starter blog template files:
- `data/blog/code-sample.mdx`
- `data/blog/deriving-ols-estimator.mdx`
- `data/blog/github-markdown-guide.mdx`
- `data/blog/guide-to-using-images-in-nextjs.mdx`
- `data/blog/introducing-tailwind-nextjs-starter-blog.mdx`
- `data/blog/my-fancy-title.mdx`
- `data/blog/new-features-in-v1.mdx`
- `data/blog/pictures-of-canada.mdx`
- `data/blog/release-of-tailwind-nextjs-starter-blog-v2.0.mdx`
- `data/blog/the-time-machine.mdx`

#### 2. Migrate Missing Content (9 files)
Copy and convert from `/old-site/docs/` to `/data/blog/`:
- `atomic.md` → `atomic.mdx`
- `cyber-security-resources.md` → `cyber-security-resources.mdx`
- `git.md` → `git.mdx`
- `llama-guard.md` → `llama-guard.mdx`
- `llm-security.md` → `llm-security.mdx`
- `phoenix-cybersecurity-events.md` → `phoenix-cybersecurity-events.mdx`
- `rc-files.md` → `rc-files.mdx`
- `splunkbotsv2.md` → `splunkbotsv2.mdx`
- `tokenGuard.md` → `tokenGuard.mdx`

#### 3. Create Migration Script
Create `scripts/migrate-markdown.js` to automate frontmatter conversion:

**Transformations:**
- Remove: `layout`, `permalink` (handled by routing)
- Add: `date` field (use current date if missing)
- Add: `draft: false`
- Add: `tags: []` if missing
- Preserve: `title`, `description`
- Convert file extension: `.md` or `.markdown` → `.mdx`

**Example transformation:**
```yaml
# OLD (Jekyll)
---
layout: page
title: "Splunk Cheatsheet"
description: "Comprehensive Splunk SPL cheatsheet"
permalink: /spl
---

# NEW (Contentlayer)
---
title: "Splunk Cheatsheet"
date: "2025-11-20"
tags: ["splunk", "siem", "cheatsheet"]
draft: false
description: "Comprehensive Splunk SPL cheatsheet"
---
```

#### 4. Audit Existing Conversions (34 files)
Verify already-migrated files:
- ✅ Correct frontmatter format
- ✅ Code blocks render correctly (syntax highlighting)
- ✅ Image paths updated: `/image/` → `/static/images/`
- ✅ Download paths updated: `/download/` → `/static/download/`

**Files to audit:**
- about.mdx, agentic-soc.mdx, ai-infosec-ally.mdx, atomconf.mdx, cactuscon-2025.mdx
- cdi.mdx, clamav.mdx, epforensics.mdx, infosec.mdx, interview.mdx
- kql-guide.mdx, latest-intel-brief.mdx, ldapsearch-WIP.mdx, llm-applicaiton-engineer.mdx
- llm-models.mdx, llm_stack.mdx, logscale.mdx, logscale_beg_guide.mdx, openui.mdx
- paretopi.mdx, program-concept.mdx, recon-ng.mdx, securityengineer.mdx, sigma-guide.mdx
- sith-cheatsheet.mdx, snort-suricata-rule-guide.mdx, socinterview.mdx
- splunk-cheatsheet.mdx, splunk-entry-cheatsheet.mdx, splunkdocker.mdx
- threathunter-interview.mdx, vLLM.mdx, virtual-python.mdx, yara-rule-guide.mdx

### Deliverables
- [ ] Migration script: `scripts/migrate-markdown.js`
- [ ] All 43 content files in `/data/blog/` as MDX
- [ ] Audit checklist with verification results

---

## SECTION B: Site Configuration & Metadata
**Agent Focus**: Configuration files, analytics, SEO
**Dependencies**: None - can start immediately
**Priority**: MEDIUM

### Tasks

#### 1. Update Site Metadata
File: `data/siteMetadata.js`

**Already correct:**
- ✅ title: 'Christian Taillon'
- ✅ author: 'Christian Taillon'
- ✅ email: 'public@christiant.io'
- ✅ siteUrl: 'https://christiant.io/'
- ✅ github, linkedin, twitter links

**Needs update:**
- Add Google Analytics ID: `G-R34BHCHXE0`
- Verify description is accurate

#### 2. Update Author Information
File: `data/authors/default.mdx`

**Current state**: Template data ("Tails Azimuth" from Stanford)

**Replace with**: Content from `/old-site/docs/about.markdown`
- Use Christian's actual bio
- Keep inline HTML styling for contact boxes
- Update social links
- Include PGP key link

#### 3. Configure Analytics
**Google Analytics:**
- ID: `G-R34BHCHXE0` (from old site `_config.yml`)
- Update in `siteMetadata.js`

**Alternative (Umami):**
- Already configured in siteMetadata
- Needs `NEXT_UMAMI_ID` environment variable

#### 4. Configure Optional Services (Low Priority)
**Newsletter** (Buttondown):
- Currently configured in siteMetadata
- Decision needed: Keep or remove?
- If keeping, needs API key in `.env`

**Comments** (Giscus):
- Currently configured in siteMetadata
- Decision needed: Keep or remove?
- If keeping, needs repo configuration

#### 5. Verify Next.js Configuration
File: `next.config.js`
- ✅ Verify CSP headers for analytics domains
- ✅ Ensure static export works if needed
- ✅ Check Contentlayer integration

### Deliverables
- [ ] Updated `data/siteMetadata.js` with analytics
- [ ] Updated `data/authors/default.mdx` with Christian's bio
- [ ] Updated `.env.example` with required variables
- [ ] Documentation on analytics setup

---

## SECTION C: Navigation & Page Structure
**Agent Focus**: Navigation, routing, homepage
**Dependencies**: Needs Section A content in place
**Priority**: MEDIUM

### Tasks

#### 1. Update Navigation
File: `data/headerNavLinks.ts`

**Current navigation (Simple):**
```typescript
{ href: '/', title: 'Home' }
{ href: '/blog', title: 'Blog' }
{ href: '/tags', title: 'Tags' }
{ href: '/projects', title: 'Projects' }
{ href: '/about', title: 'About' }
```

**Old Jekyll navigation (Complex - 5 categories):**
- Information Security (19 links)
- Threat Hunting and Intel (14 links)
- Dev and Projects (13 links)
- Machine Learning and AI (15 links)
- Interview Resources (5 links)

**Decision**: Keep simple navigation
**Recommendation**: Use tags and search for content discovery

#### 2. Customize Homepage
File: `app/page.tsx` and `app/Main.tsx`

**Current**: Simple blog list (shows latest 5 posts)

**Options:**
1. **Keep simple** (recommended) - just update description
2. **Add welcome section** - profile image + brief intro
3. **Recreate Jekyll homepage** - full welcome with featured content

**Old Jekyll homepage included:**
- Profile image
- Welcome text: "Hello world! ☕ My name is Christian"
- Links to: BOTS v2 walkthrough, OpenWebUI, CactusCon 2025
- "Latest Public Taillon Intel Brief"

#### 3. Verify About Page
File: `app/about/page.tsx`
- Uses `/data/blog/about.mdx`
- Verify inline HTML renders correctly
- Test contact boxes styling

#### 4. Tag System Audit
- Review tags from all migrated posts
- Ensure tag pages generate correctly
- Verify tag search functionality

### Deliverables
- [ ] Updated `data/headerNavLinks.ts`
- [ ] Homepage customization (if desired)
- [ ] Tag audit document
- [ ] Navigation documentation

---

## SECTION D: Special Pages & Assets
**Agent Focus**: Resume, special pages, static files
**Dependencies**: None - can start immediately
**Priority**: MEDIUM

### Tasks

#### 1. Migrate Special Pages

**Resume Page**
- Source: `/old-site/resume.html`
- Create: `app/resume/page.tsx`
- Functionality: Embed PDF viewer or link to PDF
- PDF location: `/public/static/download/resume.pdf` (if exists)

**Agentic SOC Page**
- Source: `/old-site/agentic-soc.html`
- Status: Already exists as `/data/blog/agentic-soc.mdx` ✅
- Decision: Keep as blog post OR create standalone page
- Old HTML had: Video embed + resource links

**DNS OSINT Page**
- Source: `/old-site/dns-osint.html`
- Simple redirect to: `/download/dns-guide-awnsers.pdf`
- Create: `app/dns-osint/page.tsx` with PDF viewer

#### 2. Migrate Static Assets

**Copy operations:**
```bash
# Images
cp -r old-site/image/* public/static/images/

# Downloads (PDFs, files)
cp -r old-site/download/* public/static/download/

# Videos
cp -r old-site/video/* public/static/video/

# Favicon
cp old-site/favicon.ico public/favicon.ico
```

**Key files to migrate:**
- `/old-site/image/professional_circle.png` → Profile image
- `/old-site/image/coffee_logo.jpeg` → Logo (if used)
- `/old-site/download/publickey.public@christiant.io-*.asc` → PGP key
- `/old-site/download/dns-guide-awnsers.pdf` → DNS guide
- `/old-site/download/*.pdf` → Presentation slides

#### 3. Verify Asset Links

**Create verification script:**
- Scan all MDX files for asset references
- Check for broken links
- Update paths:
  - `/image/` → `/static/images/`
  - `/download/` → `/static/download/`
  - `/video/` → `/static/video/`

**Common pattern to find:**
```bash
# Search for old paths
grep -r "/image/" data/blog/
grep -r "/download/" data/blog/
grep -r "src=\"/image" data/blog/
```

### Deliverables
- [ ] Resume page: `app/resume/page.tsx`
- [ ] DNS OSINT page: `app/dns-osint/page.tsx`
- [ ] All static assets migrated to `/public/static/`
- [ ] Asset path verification script
- [ ] List of broken links (if any)

---

## SECTION E: Build, Test & Deploy
**Agent Focus**: Quality assurance, deployment
**Dependencies**: Needs Sections A, B, C, D mostly complete
**Priority**: FINAL

### Tasks

#### 1. Local Build Test
```bash
# Install dependencies
yarn install

# Build the site
yarn build

# Start production server
yarn start
```

**Verify:**
- ✅ Build completes without errors
- ✅ All pages accessible
- ✅ No 404 errors
- ✅ Images load correctly
- ✅ Code blocks render with syntax highlighting

#### 2. Content Verification
**Spot-check 10 random blog posts:**
1. Frontmatter displays correctly
2. Markdown renders properly
3. Code blocks have syntax highlighting
4. Images display
5. Links work (internal and external)
6. Tags display and link correctly

**Test core functionality:**
- Search (Kbar) works
- Tag navigation works
- Blog pagination works
- Dark/light theme toggle works
- Responsive design (mobile/tablet/desktop)

#### 3. Performance Check
**Run Lighthouse audit:**
```bash
# Build and serve
yarn build
yarn start

# Run lighthouse (or use Chrome DevTools)
```

**Check:**
- Performance score > 90
- Accessibility score > 90
- Best Practices score > 90
- SEO score > 90

**Bundle analysis:**
```bash
yarn analyze
```
- Verify reasonable bundle size
- Check for unnecessary dependencies

#### 4. Link Verification
**Internal links:**
- All blog post links work
- Tag pages generate correctly
- Navigation links work
- Asset links (images, downloads, videos) work

**External links:**
- Social media links work
- GitHub repo links work
- External resource links work

#### 5. Git Commit & Push
**Create commits:**
```bash
# 1. Content migration
git add data/blog/ scripts/migrate-markdown.js
git commit -m "Migrate all content from Jekyll to MDX"

# 2. Configuration
git add data/siteMetadata.js data/authors/default.mdx
git commit -m "Update site configuration and author information"

# 3. Navigation and pages
git add data/headerNavLinks.ts app/
git commit -m "Update navigation and create special pages"

# 4. Static assets
git add public/static/
git commit -m "Migrate static assets from old site"

# 5. Build verification
git add .
git commit -m "Final build verification and cleanup"
```

**Push to remote:**
```bash
git push -u origin claude/jekyll-migration-planning-01S8HjbcrSS7BC4w1boEgyRq
```

#### 6. Deployment
**Platform options:**
1. Vercel (recommended for Next.js)
2. GitHub Pages (static export)
3. Netlify
4. Custom hosting

**Build for static export (if needed):**
```bash
EXPORT=1 UNOPTIMIZED=1 yarn build
# Output in /out directory
```

### Deliverables
- [ ] Build success confirmation
- [ ] Link verification report
- [ ] Performance audit results
- [ ] All changes committed and pushed
- [ ] Deployment documentation

---

## Execution Strategy

### Phase 1: Immediate Parallel Start (No Dependencies)
Launch simultaneously:
- **Section A** - Content Migration (highest priority)
- **Section B** - Site Configuration (quick wins)
- **Section D** - Static Assets (straightforward)

### Phase 2: After Content Complete
- **Section C** - Navigation & Page Structure (needs content to test)

### Phase 3: Final Stage
- **Section E** - Build, Test & Deploy (needs everything else)

---

## Key Principles

### Keep It Simple
1. **Don't recreate complex navigation** - Use simple 5-link header + tags
2. **Don't over-style** - Use Tailwind defaults, customize gradually
3. **Keep markdown workflow** - Files in `/data/blog/` like `/docs/` before
4. **Script repetitive tasks** - Automate frontmatter conversion
5. **Test incrementally** - Build after each major section

### Content Management
- Single markdown (MDX) file per page in `/data/blog/`
- Frontmatter for metadata (title, date, tags, description)
- Static assets in `/public/static/`
- No database, no complex CMS

### Quality Standards
- All pages must build without errors
- No broken links
- Images must load
- Code syntax highlighting must work
- Lighthouse score > 90

---

## Reference Information

### Old Jekyll Site Structure
```
old-site/
├── docs/              # 43 markdown content files
├── image/             # Static images
├── download/          # PDFs, documents
├── video/             # Video files
├── _config.yml        # Jekyll configuration
├── index.markdown     # Homepage
├── resume.html        # Resume page
├── agentic-soc.html   # Special page
└── dns-osint.html     # Special page
```

### New Next.js Site Structure
```
website/
├── app/               # Next.js pages and routes
├── data/
│   ├── blog/          # MDX content files (44 files)
│   ├── authors/       # Author information
│   └── siteMetadata.js
├── public/
│   └── static/        # Static assets
│       ├── images/
│       ├── download/
│       └── video/
├── components/        # React components
├── layouts/           # Page layouts
└── scripts/           # Build and migration scripts
```

### Old Jekyll Config (_config.yml)
- **Analytics**: Google Analytics `G-R34BHCHXE0`
- **Theme**: daattali/beautiful-jekyll
- **Colors**: Dark nav (#0e0e0e), gold links (#fcc624)
- **Timezone**: America/Phoenix
- **Email**: public@christiant.io
- **Twitter**: @christian_tail
- **GitHub**: christian-taillon

### Files Migrated vs Missing

**Already Migrated (34):**
about, agentic-soc, ai-infosec-ally, atomconf, cactuscon-2025, cdi, clamav, epforensics, infosec, interview, kql-guide, latest-intel-brief, ldapsearch-WIP, llm-applicaiton-engineer, llm-models, llm_stack, logscale, logscale_beg_guide, openui, paretopi, program-concept, recon-ng, securityengineer, sigma-guide, sith-cheatsheet, snort-suricata-rule-guide, socinterview, splunk-cheatsheet, splunk-entry-cheatsheet, splunkdocker, threathunter-interview, vLLM, virtual-python, yara-rule-guide

**Need Migration (9):**
atomic, cyber-security-resources, git, llama-guard, llm-security, phoenix-cybersecurity-events, rc-files, splunkbotsv2, tokenGuard

**Template Files to Remove (10):**
code-sample, deriving-ols-estimator, github-markdown-guide, guide-to-using-images-in-nextjs, introducing-tailwind-nextjs-starter-blog, my-fancy-title, new-features-in-v1, pictures-of-canada, release-of-tailwind-nextjs-starter-blog-v2.0, the-time-machine

---

## Success Criteria

- [ ] All 43 content files migrated and rendering correctly
- [ ] No template files remaining
- [ ] Author bio updated with Christian's information
- [ ] Analytics configured and working
- [ ] All static assets migrated and accessible
- [ ] Special pages (resume, dns-osint) working
- [ ] Site builds without errors
- [ ] All links verified (no 404s)
- [ ] Lighthouse score > 90
- [ ] Responsive design works on all devices
- [ ] Search functionality works
- [ ] Tag system works
- [ ] Code syntax highlighting works
- [ ] Dark/light theme toggle works

---

## Notes for Agents

### Agent Communication
- Each section is independent and non-overlapping
- Section E (Build & Test) should coordinate with all other sections
- Report blockers immediately
- Document all decisions and changes

### Common Issues to Watch For
1. **Image paths** - Old: `/image/`, New: `/static/images/`
2. **Frontmatter format** - Different between Jekyll and Contentlayer
3. **HTML in markdown** - May need special handling in MDX
4. **Code blocks** - Verify language tags work
5. **Permalink conflicts** - Old permalinks won't work in Next.js routing

### File Naming Conventions
- Use lowercase with hyphens: `my-blog-post.mdx`
- Preserve original filename when migrating
- Use `.mdx` extension for all content files

### Testing Checklist per Section
Each agent should verify their work:
- Changes build without errors
- No new warnings or errors in console
- Functionality works as expected
- Changes committed with clear messages

---

**Last Updated**: 2025-11-22
**Status**: Ready for agent execution
