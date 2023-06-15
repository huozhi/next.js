import type { RenderOpts } from './types'
import type { FlightResponseRef } from './flight-response-ref'

import React, { use } from 'react'
import { createErrorHandler } from './create-error-handler'
import { useFlightResponse } from './use-flight-response'

/**
 * Create a component that renders the Flight stream.
 * This is only used for renderToHTML, the Flight response does not need additional wrappers.
 */
export function createServerComponentRenderer<Props>(
  ComponentToRender: (props: Props) => any,
  ComponentMod: {
    renderToReadableStream: any
    __next_app__?: {
      require: any
      loadChunk: any
    }
  },
  {
    transformStream,
    clientReferenceManifest,
    serverContexts,
    rscChunks,
  }: {
    transformStream: TransformStream<Uint8Array, Uint8Array>
    clientReferenceManifest: NonNullable<RenderOpts['clientReferenceManifest']>
    serverContexts: Array<
      [ServerContextName: string, JSONValue: Object | number | string]
    >
    rscChunks: Uint8Array[]
  },
  serverComponentsErrorHandler: ReturnType<typeof createErrorHandler>,
  nonce?: string
): (props: Props) => JSX.Element {
  // We need to expose the bundled `require` API globally for
  // react-server-dom-webpack. This is a hack until we find a better way.
  if (ComponentMod.__next_app__) {
    // @ts-ignore
    globalThis.__next_require__ = ComponentMod.__next_app__.require

    // @ts-ignore
    globalThis.__next_chunk_load__ = ComponentMod.__next_app__.loadChunk
  }

  let RSCStream: ReadableStream<Uint8Array>
  const createRSCStream = (props: Props) => {
    if (!RSCStream) {
      const start = performance.now()
      RSCStream = ComponentMod.renderToReadableStream(
        <ComponentToRender {...(props as any)} />,
        clientReferenceManifest.clientModules,
        {
          context: serverContexts,
          onError: serverComponentsErrorHandler,
        }
      )
      console.log('app:RSC:renderToReadableStream', performance.now() - start)
    }
    return RSCStream
  }

  const flightResponseRef: FlightResponseRef = { current: null }

  const writable = transformStream.writable
  return function ServerComponentWrapper(props: Props): JSX.Element {
    let start = performance.now()
    const reqStream = createRSCStream(props)
    // console.log('app:RSC:renderToReadableStream', performance.now() - start)

    start = performance.now()
    const response = useFlightResponse(
      writable,
      reqStream,
      clientReferenceManifest,
      rscChunks,
      flightResponseRef,
      nonce
    )
    // console.log('app:RSC:useFlightResponse', performance.now() - start)
    return use(response)
  }
}
