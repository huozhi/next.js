export default function Home({ params: { count } }) {
  return (
    <main>
      {new Array(+count || 1).fill(0).map((_, i) => (
        <div key={i}>{i}</div>
      ))}
    </main>
  )
}
