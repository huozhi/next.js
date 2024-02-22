import { parseDiff, Diff, Hunk } from 'next/dist/compiled/react-diff-view'
// @ts-ignore
import { html as pretty } from 'js-beautify'
// @ts-ignore
import { formatLines, diffLines } from 'next/dist/compiled/unidiff'

function DiffView({ diffText }: { diffText: string }) {
  const files = parseDiff(diffText, { nearbySequences: 'zip' })
  return (
    <div>
      {files.map((file: any) => {
        const { oldRevision, newRevision, type, hunks } = file
        return (
          <Diff
            optimizeSelection
            key={oldRevision + '-' + newRevision}
            viewType="split"
            diffType={type}
            hunks={hunks}
          >
            {(hunks: any) =>
              hunks.map((hunk: any) => <Hunk key={hunk.content} hunk={hunk} />)
            }
          </Diff>
        )
      })}
    </div>
  )
}

export type HydrationDiff = {
  ssrHtml: string
  csrHtml: string
}

export function HtmlDiffView() {
  const hydrationDiff: HydrationDiff = (globalThis as any).hydrationDiff
  const serverHtml = pretty(hydrationDiff.ssrHtml)
  const clientHtml = pretty(hydrationDiff.csrHtml)

  const diffText = formatLines(diffLines(serverHtml, clientHtml))
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <h2>Hydration Mismatch Difference</h2>
      <p>Server vs Client</p>
      <DiffView diffText={diffText} />
    </div>
  )
}
