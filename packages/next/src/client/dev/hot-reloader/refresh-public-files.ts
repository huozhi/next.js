// Files in the `public` folder aren't part of the module graph, so there is no
// module to hot update when they change. Instead, point the elements that use
// a changed file at a new URL so the browser requests it again.

const VERSION_PARAM = '__nextPublicFileVersion'

const URL_ATTRIBUTES: ReadonlyArray<[selector: string, attribute: string]> = [
  ['img[src]', 'src'],
  ['source[src]', 'src'],
  ['video[poster]', 'poster'],
  ['link[rel~="icon"][href]', 'href'],
  ['link[rel="apple-touch-icon"][href]', 'href'],
]

const SRCSET_SELECTOR = 'img[srcset], source[srcset]'

function safeDecode(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

/**
 * Returns `url` with a new version param when it points at one of `paths`,
 * either directly or as the source of an image optimization URL.
 */
function getRefreshedUrl(
  url: string,
  paths: ReadonlySet<string>,
  version: string
): string | null {
  let parsed: URL
  try {
    parsed = new URL(url, document.baseURI)
  } catch {
    return null
  }
  if (parsed.origin !== location.origin) {
    return null
  }

  let pathname = parsed.pathname
  const imageUrl = parsed.pathname.endsWith('/_next/image')
    ? parsed.searchParams.get('url')
    : null
  if (imageUrl?.startsWith('/') && !imageUrl.startsWith('//')) {
    pathname = new URL(imageUrl, location.origin).pathname
  }

  if (!paths.has(safeDecode(pathname))) {
    return null
  }

  parsed.searchParams.set(VERSION_PARAM, version)
  // The URL is same-origin, so the absolute path is equivalent.
  return parsed.pathname + parsed.search + parsed.hash
}

export function refreshPublicFiles(changedPaths: ReadonlyArray<string>) {
  const paths = new Set(changedPaths)
  const version = String(Date.now())

  for (const [selector, attribute] of URL_ATTRIBUTES) {
    for (const element of document.querySelectorAll(selector)) {
      const refreshedUrl = getRefreshedUrl(
        element.getAttribute(attribute)!,
        paths,
        version
      )
      if (refreshedUrl !== null) {
        element.setAttribute(attribute, refreshedUrl)
      }
    }
  }

  for (const element of document.querySelectorAll(SRCSET_SELECTOR)) {
    let changed = false
    const candidates = element
      .getAttribute('srcset')!
      .split(',')
      .map((candidate) => {
        const [url, ...descriptors] = candidate.trim().split(/\s+/)
        const refreshedUrl = url ? getRefreshedUrl(url, paths, version) : null
        if (refreshedUrl === null) {
          return candidate.trim()
        }
        changed = true
        return [refreshedUrl, ...descriptors].join(' ')
      })
    if (changed) {
      element.setAttribute('srcset', candidates.join(', '))
    }
  }
}
