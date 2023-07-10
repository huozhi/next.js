export default async function Page({ params }) {
  const { slug } = params

  const { default: Component } = await import(`../_content/${slug}`)

  return <Component />
}
