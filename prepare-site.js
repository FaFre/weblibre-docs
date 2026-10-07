const fs = require('node:fs')
const path = require('node:path')

const siteDir = path.join(__dirname, 'build/site')
const pagesDir = path.join(__dirname, 'docs/modules/ROOT/pages')
const legacyDir = path.join(siteDir, 'weblibre')
const siteUrl = new URL('https://docs.weblibre.eu/')

if (!fs.existsSync(path.join(siteDir, 'sitemap.xml'))) {
  throw new Error('Antora sitemap is missing; generate the site before preparing it.')
}

const sitemapXml = fs.readFileSync(path.join(siteDir, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) =>
  loc.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
)

if (sitemapUrls.length === 0) {
  throw new Error('Antora sitemap contains no page URLs.')
}

fs.writeFileSync(path.join(siteDir, 'sitemap.txt'), `${sitemapUrls.join('\n')}\n`)

const sourcePages = listFiles(pagesDir).filter((file) => file.endsWith('.adoc'))
const expectedUrls = new Set()

for (const sourcePage of sourcePages) {
  const relativePage = path.relative(pagesDir, sourcePage).replace(/\.adoc$/, '.html')
  const encodedPage = relativePage.split(path.sep).map(encodeURIComponent).join('/')
  const targetUrl = new URL(encodedPage, siteUrl).href
  const sitemapUrl = targetUrl.replace(/&/g, '&amp;')

  if (!sitemapUrls.includes(targetUrl) && !sitemapXml.includes(`<loc>${sitemapUrl}</loc>`)) {
    throw new Error(`Page is missing from Antora sitemap: ${targetUrl}`)
  }

  expectedUrls.add(targetUrl)

  const legacyPage = path.join(legacyDir, relativePage)
  fs.mkdirSync(path.dirname(legacyPage), { recursive: true })
  fs.writeFileSync(legacyPage, createRedirectPage(targetUrl))
}

if (expectedUrls.size !== sitemapUrls.length) {
  throw new Error(`Expected ${expectedUrls.size} sitemap pages, found ${sitemapUrls.length}.`)
}

for (const assetDir of ['_', '_images', '_attachments']) {
  const source = path.join(siteDir, assetDir)
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(legacyDir, assetDir), { recursive: true, force: true })
  }
}

console.log(`Prepared ${sourcePages.length} legacy page redirects and a ${sitemapUrls.length}-URL text sitemap.`)

function listFiles (directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath]
  })
}

function createRedirectPage (targetUrl) {
  const escapedUrl = targetUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="canonical" href="${escapedUrl}">
  <meta http-equiv="refresh" content="0; url=${escapedUrl}">
  <meta name="robots" content="noindex">
  <title>Page Moved</title>
</head>
<body>
  <p>This page has moved to <a href="${escapedUrl}">${escapedUrl}</a>.</p>
</body>
</html>
`
}
