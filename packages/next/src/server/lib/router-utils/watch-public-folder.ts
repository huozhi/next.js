import path from 'path'
import Watchpack from 'next/dist/compiled/watchpack'
import { normalizePathSep } from '../../../shared/lib/page-path/normalize-path-sep'

/**
 * Files in the `public` folder aren't part of the module graph, so the bundler
 * never reports when they change. Watch the folder directly and report the URL
 * pathnames of changed files, so the browser can re-request them.
 */
export function watchPublicFolder(
  publicDir: string,
  basePath: string,
  onChange: (paths: string[]) => void
): () => void {
  const wp = new Watchpack({
    aggregateTimeout: 5, // Matches setup-dev-bundler.ts.
  })

  // `aggregated` reports the watched directory rather than the files in it, so
  // collect the changed files from the individual `change` events.
  let changedFiles = new Set<string>()
  wp.on('change', (file: string) => {
    changedFiles.add(file)
  })
  wp.on('aggregated', () => {
    const paths: string[] = []
    for (const file of changedFiles) {
      const relativePath = path.relative(publicDir, file)
      if (!relativePath || relativePath.startsWith('..')) continue
      paths.push(basePath + '/' + normalizePathSep(relativePath))
    }
    changedFiles = new Set()
    if (paths.length > 0) {
      onChange(paths)
    }
  })

  // Only report changes made after the dev server started.
  wp.watch({ directories: [publicDir], startTime: Date.now() })

  return () => wp.close()
}
