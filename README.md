# Christian Taillon - Personal Website

Personal website and blog for Christian Taillon, Security Engineer and Director of Threat Intelligence.

## About

This site serves as a resource hub for cybersecurity professionals, featuring:

- **Technical Blog Posts**: Guides on Splunk, threat hunting, SOC operations, LLM security, and OSINT
- **Security Cheatsheets**: Quick reference materials for security tools and techniques
- **Projects**: Open-source contributions and threat hunting resources
- **About**: Professional background and expertise

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Content**: MDX with Contentlayer 2
- **Analytics**: Google Analytics & Umami
- **Comments**: Giscus
- **Newsletter**: Buttondown
- **Deployment**: GitHub Pages

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Run production build locally
yarn serve
```

## Content Management

Blog posts are located in `data/blog/` as MDX files. Each post includes frontmatter for metadata:

```yaml
---
title: 'Post Title'
date: '2025-01-01'
tags: ['cybersecurity', 'splunk', 'threat-hunting']
draft: false
summary: 'Brief description of the post'
---
```

## Configuration

Key configuration files:
- `data/siteMetadata.js` - Site-wide settings, analytics, social links
- `data/authors/default.mdx` - Author bio and information
- `data/projectsData.ts` - Projects showcase
- `data/headerNavLinks.ts` - Navigation menu items

## Environment Variables

Create a `.env` file for sensitive configuration:

```env
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPOSITORY_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
NEXT_UMAMI_ID=
```

## License

MIT © Christian Taillon

---

Built with [Tailwind Nextjs Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)
