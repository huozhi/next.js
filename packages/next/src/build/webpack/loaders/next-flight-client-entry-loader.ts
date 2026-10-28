import type { webpack } from 'next/dist/compiled/webpack/webpack'
import {
  BARREL_OPTIMIZATION_PREFIX,
  RSC_MODULE_TYPES,
} from '../../../shared/lib/constants'
import { getModuleBuildInfo } from './get-module-build-info'
import { isImageResource, regexCSS } from './utils'

/**
 * { [client import path]: [exported names] }
 */
export type ClientComponentImports = Record<string, Set<string>>
export type CssImports = Record<string, string[]>

export type NextFlightClientEntryLoaderOptions = {
  modules: string[] | string
  /** This is transmitted as a string to `getOptions` */
  server: boolean | 'true' | 'false'
}

export type FlightClientEntryModuleItem = {
  // module path
  request: string
  // imported identifiers
  ids: string[]
}

export default function transformSource(
  this: webpack.LoaderContext<NextFlightClientEntryLoaderOptions>
) {
  let { modules, server } = this.getOptions()
  const isServer = server === 'true'

  if (!Array.isArray(modules)) {
    modules = modules ? [modules] : []
  }

  const items = modules
    .map((x) => JSON.parse(x) as FlightClientEntryModuleItem)
    // Filter out CSS files in the SSR compilation
    .filter(({ request }) => (isServer ? !regexCSS.test(request) : true))

  let code = items
    .map(({ request, ids }: FlightClientEntryModuleItem) => {
      const importPath = JSON.stringify(
        request.startsWith(BARREL_OPTIMIZATION_PREFIX)
          ? request.replace(':', '!=!')
          : request
      )

      // When we cannot determine the export names, we use eager mode to include the whole module.
      // Otherwise, we use eager mode with webpackExports to only include the necessary exports.
      // If we have '*' in the ids, we include all the imports
      if (ids.length === 0 || ids.includes('*')) {
        return `import(/* webpackMode: "eager" */ ${importPath});\n`
      } else {
        return `import(/* webpackMode: "eager", webpackExports: ${JSON.stringify(
          ids
        )} */ ${importPath});\n`
      }
    })
    .join(';\n')

  // Images imported by Server Components are added to the client entry so the
  // client compilation emits them. They aren't rendered by client code, so
  // nothing on the client accepts their updates and an edit would bubble up
  // to the entry and force a full reload. Accept them here instead: the
  // Server Components refresh renders the new image URL.
  if (!isServer && this.hot) {
    const imageRequests = items
      .map(({ request }) => request)
      .filter(isImageResource)
    if (imageRequests.length > 0) {
      code += `\nif (module.hot) module.hot.accept(${JSON.stringify(
        imageRequests
      )});\n`
    }
  }

  const buildInfo = getModuleBuildInfo(this._module!)

  buildInfo.rsc = {
    type: RSC_MODULE_TYPES.client,
  }
  if (process.env.BUILTIN_FLIGHT_CLIENT_ENTRY_PLUGIN) {
    const rscModuleInformationJson = JSON.stringify(buildInfo.rsc)
    return (
      `/* __rspack_internal_rsc_module_information_do_not_use__ ${rscModuleInformationJson} */\n` +
      code
    )
  }

  return code
}
