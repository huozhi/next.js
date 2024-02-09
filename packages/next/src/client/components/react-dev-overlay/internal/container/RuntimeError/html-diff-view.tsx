import React, { useEffect, useRef } from 'react'

import 'diff2html/dist/diff2html.css'
import { Diff2Html } from 'diff2html'

const HtmlDiffView = ({ htmlA, htmlB }: { htmlA: string; htmlB: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current || !htmlA || !htmlB) return

    // Clear the container
    containerRef.current.innerHTML = ''

    // Parse diff
    const diffOutput = Diff2Html.getPrettyHtml(htmlA, htmlB)

    // Render diff
    containerRef.current.innerHTML = diffOutput
  }, [htmlA, htmlB])

  return <div ref={containerRef} />
}

export { HtmlDiffView }
