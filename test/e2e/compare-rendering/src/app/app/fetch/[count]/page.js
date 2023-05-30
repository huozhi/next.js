const Pokemon = ({ pokemon }) => {
  return (
    <>
      {Object.keys(pokemon).map((k) => (
        <div key={[pokemon.id, k].join(',')}>{pokemon[k].toString()}</div>
      ))}
    </>
  )
}

const origin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export default async function Home({ params: { count } }) {
  const pokemonReq = await fetch(`${origin}/pokemon-${count}.json`, {
    cache: 'no-cache',
  })
  const pokemon = await pokemonReq.json()

  return (
    <main>
      <h1>Pokemon</h1>
      {pokemon.map((p) => (
        <div key={p.id} className="flex flex-row gap-2">
          <Pokemon pokemon={p} />
        </div>
      ))}
    </main>
  )
}
