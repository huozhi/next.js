import { RouteKind } from '../../../route-kind'

// import { GlobalError } from '../../../../../client/components/error-boundary'
import AppRouteModule from '../module'

export const routeModule = new AppRouteModule({
  // TODO: add descriptor for internal error page
  definition: {
    kind: RouteKind.APP_PAGE,
    page: '/_error',
    pathname: '/_error',
    filename: '',
    bundlePath: '',
    appPaths: [],
  },
  userland: { loaderTree: ['__DEFAULT__', {}, {}] },
})
