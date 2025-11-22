import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Resume' })

export default function ResumePage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Resume
        </h1>
      </div>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <div className="not-prose">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Resume Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Resume content will be available here. In the meantime, please visit my{' '}
              <a
                href="https://linkedin.com/in/christian-taillon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                LinkedIn profile
              </a>{' '}
              or check out my work on{' '}
              <a
                href="https://github.com/christian-taillon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
