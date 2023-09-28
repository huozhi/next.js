import { RouteKind } from '../../../route-kind'

// import { GlobalError } from '../../../../../client/components/error-boundary'
import AppRouteModule from '../module'

import * as moduleError from '../../../../../client/components/not-found-error'
import { LoaderTree } from '../../../../lib/app-dir-module'

export * from '../../../../../server/app-render/entry-base'

const loaderTree: LoaderTree = [
  '',
  {
    children: [
      '__PAGE__',
      {},
      {
        page: [
          () => require('next/dist/client/components/not-found-error'),
          'next/dist/client/components/not-found-error',
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

export const routeModule = new AppRouteModule({
  // TODO: add descriptor for internal error page
  definition: {
    kind: RouteKind.APP_PAGE,
    page: '/not-found',
    pathname: '/not-found',
    filename: 'next/dist/client/components/not-found-error.js',
    bundlePath: 'app/not-found',
    appPaths: ['/not-found'],
  },
  userland: {
    ...moduleError,
    loaderTree,
  },
})
