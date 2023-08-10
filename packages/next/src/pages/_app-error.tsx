'use client'

import React from 'react'
// export { NotFound as default } from '../client/components/error'
import type { LoaderTree } from '../server/lib/app-dir-module'

export default function Component() {
  return null
}

export * from '../server/app-render/entry-base'

export const loaderTree: LoaderTree = [
  '',
  {
    children: [
      '__PAGE__',
      {},
      {
        page: [
          () => require('next/dist/client/image-component/not-found'),
          'next/dist/client/image-component/not-found',
        ],
      },
    ],
  },
  {
    layout: [
      () => require('next/dist/client/components/default-layout'),
      'next/dist/client/components/default-layout',
    ],
  },
]
