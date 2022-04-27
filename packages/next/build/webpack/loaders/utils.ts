export const defaultJsFileExtensions = ['js', 'mjs', 'jsx', 'ts', 'tsx']
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif']
const nextClientComponents = ['link', 'image', 'head', 'script']

const NEXT_BUILT_IN_CLIENT_RSC_FILE_PATH_REGEX = new RegExp(
  `[\\\\/]next[\\\\/](${nextClientComponents.join('|')})\\.js$`
)

const NEXT_BUILT_IN_CLIENT_RSC_IMPORT_PATH_REGEX = new RegExp(
  `next/${nextClientComponents.join('|')}`
)

export function isNextBuiltinClientComponent(
  resourcePath: string,
  { fullPath }: { fullPath: boolean }
) {
  const regex = fullPath
    ? NEXT_BUILT_IN_CLIENT_RSC_FILE_PATH_REGEX
    : NEXT_BUILT_IN_CLIENT_RSC_IMPORT_PATH_REGEX

  return regex.test(resourcePath)
}

export function buildExports(moduleExports: any, isESM: boolean) {
  let ret = ''
  Object.keys(moduleExports).forEach((key) => {
    const exportExpression = isESM
      ? `export ${key === 'default' ? key : `const ${key} =`} ${
          moduleExports[key]
        }`
      : `exports.${key} = ${moduleExports[key]}`

    ret += exportExpression + '\n'
  })
  return ret
}

export const createClientComponentFilter = () => {
  // Special cases for Next.js APIs that are considered as client components:
  // - .client.[ext]
  // - next built-in client components
  // - .[imageExt]
  const regex = new RegExp(
    '(' +
      `\\.client(\\.(${defaultJsFileExtensions.join('|')}))?|` +
      `next/(${nextClientComponents.join('|')})(\\.js)?|` +
      `\\.(${imageExtensions.join('|')})` +
      ')$'
  )

  return (importSource: string) => regex.test(importSource)
}

export const createServerComponentFilter = () => {
  const regex = new RegExp(
    `\\.server(\\.(${defaultJsFileExtensions.join('|')}))?$`
  )
  return (importSource: string) => regex.test(importSource)
}
