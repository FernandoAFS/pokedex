import { randomUUID } from 'crypto'
import { PrismaClient, PokemonType } from '@prisma/client'
import pokemonDetailsJson from './pokemonDetails.json'
import pokemonEvolutionJson from './pokemonEvolution.json'

const prisma = new PrismaClient()


// GENERATOR THAT RETUNS TUPLE OF NAMES. EACH TUPLE IS A FORWARD EVOLUTION STEP
function* pokemonEvolution(): Generator<[string, string]> {
  /**
   * Generator that retuns tuple of names. each tuple is a forward evolution step
   * This function reads directly from the json template
   */
  const nameEntries = Object.entries(pokemonEvolutionJson.pokemon_name)

  const evolutions = pokemonEvolutionJson.evolutions

  for (const [id, name] of nameEntries) {
    const [ev] = evolutions[id as keyof typeof evolutions]
    if (!ev)
      continue
    yield [name.toLowerCase(), ev.pokemon_name.toLowerCase()]
  }
}

function* evolutionFamilyIdTuples(evolutions: Map<string, string>): Generator<[string, string]> {
  /**
   * Generator that returns name-branchId. All pokemon that belong to the same evolution path will have
   * the same branchId. A branch ID is a random uuid
   */

  // Need to find the first step to start descending the table.
  // This is those who have a key but are never values in the evolution map.
  function* firstEvolutionStep(): Generator<string> {
    const evolvesSet = new Set(evolutions.keys())
    const evolvedToSet = new Set(evolutions.values())
    yield* evolvesSet.difference(evolvedToSet).values()
  }

  // Recusively follow the table. yield all the steps along the way.
  // Implemented as a generator for memory efficiency.
  function* recurse(id: string): Generator<string> {
    yield id
    if (!evolutions.has(id))
      return
    yield* recurse(evolutions.get(id) as string)
  }

  for (const f of firstEvolutionStep()) {
    const branch = [...recurse(f)]
    // THIS SHOULDN'T HAPPEN 
    if (branch.length <= 0)
      continue
    const uuid = randomUUID()
    for (const b of branch) {
      yield [b, uuid]
    }
  }
}

function pokemonTypeParse(s: string | null): PokemonType | undefined {
  if (!s)
    return
  if (s == '-')
    return
  return s.toUpperCase() as PokemonType
}


async function main() {

  const evolutionMap = new Map(pokemonEvolution())
  const evolutionBranches = new Map(evolutionFamilyIdTuples(evolutionMap))

  const pokemonDetails = Object.values(pokemonDetailsJson).map(o => {
    const type1 = pokemonTypeParse(o.type1) as PokemonType
    const type2 = pokemonTypeParse(o.type2)
    const { stats: { hp, attack, defense, spatk, spdef, speed, }, } = o

    return {
      name: o.pokemonid.toLowerCase(),
      generation: o.gen,
      type1,
      type2,
      hp,
      attack,
      defense,
      spatk,
      spdef,
      speed,
    }
  })

  function* uniqueNamedPokemonGenerator(){
    const names = new Set<string>()
    for(const p of pokemonDetails){
      if(names.has(p.name))
        continue
      names.add(p.name)
      yield p
    }
  }

  const uniqueNamesPokemon = [ ...uniqueNamedPokemonGenerator() ]

  await prisma.$transaction(async (tx) => {
    // START FROM SCRATCH EACH TIME
    await tx.pokemonDetails.deleteMany()

    const dbPokemon = await tx.pokemonDetails.createManyAndReturn({ data: uniqueNamesPokemon })

    const updatePromises = dbPokemon.map(async ({ pokemonId, name }) => {
      // pokemonId
      const evolvesToName = evolutionMap.get(name)
      const evolvesToBranch = evolutionBranches.get(name)

      if (!evolvesToBranch)
        return

      // KEEP IN MIND THAT LAST STEP OF THE EVOLUTION NEEDS THE FAMILY INFORMED.
      const evolvesToRes = await tx.pokemonDetails.findFirst({ where: { name: evolvesToName } })
      const updateData = {
        ...(evolvesToRes && {
          evolvesTo: {
            connect: {
              pokemonId: evolvesToRes.pokemonId
            }
          },
        }),
        evolutionFamilyId: evolvesToBranch,
      }

      return await tx.pokemonDetails.update({
        where: {
          pokemonId
        },
        data: updateData
      })
    })

    await Promise.all(updatePromises)
  })

}

main()
  .catch(async e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



