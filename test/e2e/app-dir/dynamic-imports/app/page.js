/** Add your relevant code here for the issue to reproduce */
export default async function Home() {
  // This works fine
  const { default: Component } = await import(
    './blog/_content/module-with-image'
  )
  return <Component />
}
