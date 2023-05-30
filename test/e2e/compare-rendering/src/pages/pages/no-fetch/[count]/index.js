export function getServerSideProps({ params: { count } }) {
  return {
    props: {
      count,
    },
  }
}

export default function Home({ count }) {
  return (
    <main>
      {new Array(+count || 1).fill(0).map((_, i) => (
        <div key={i}>{i}</div>
      ))}
    </main>
  )
}
