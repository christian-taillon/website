import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'DNS OSINT Guide' })

export default function DnsOsintPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          DNS OSINT Guide
        </h1>
      </div>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <div className="not-prose mb-4">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Comprehensive guide to DNS Open Source Intelligence (OSINT) techniques and best
            practices.
          </p>
          <a
            href="/static/download/dns-guide-awnsers.pdf"
            download
            className="mb-6 inline-block rounded bg-primary-500 px-4 py-2 font-bold text-white hover:bg-primary-600 dark:hover:bg-primary-400"
          >
            Download PDF
          </a>
        </div>
        <div className="not-prose">
          <iframe
            src="/static/download/dns-guide-awnsers.pdf"
            className="h-[800px] w-full rounded-lg border border-gray-300 dark:border-gray-600"
            title="DNS OSINT Guide PDF"
          />
        </div>
      </div>
    </div>
  )
}
