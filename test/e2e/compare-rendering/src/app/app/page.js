export default function Home({ params }) {
  const count = params.count || 0
  return (
    <main>
      {Array(count)
        .fill()
        .map((_, i) => (
          <div key={i}>Hello World</div>
        ))}
    </main>
  )
}
