import { getPokemonByUuid } from "@/db/pokemon";
import Image from "next/image";
import { PokeStat, PokeDetail, PokeTypeTag } from "@/components/pokeDetails";
import { PokemonCard } from "@/components/pokeCard";
import Link from "next/link";

async function PokemonDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const pokemon = await getPokemonByUuid({ uuid: slug });

  // IMPROVE A LOT ON THIS. PROBABLY RAISE AN ERROR, 404...
  if (!pokemon) return "Not found...";

  const {
    pokemon: {
      name,
      generation,
      hp,
      attack,
      defense,
      spatk,
      spdef,
      speed,
      type1,
      type2,
      pokemonId,
    },
    evolutionBranch,
  } = pokemon;

  const pokeTypes = [...new Set([type1, ...(type2 ? [type2] : [])])];

  return (
    <>
      <div className="col-span-full text-center w-full text-6xl">
        Poke-Details
      </div>
      <div className="col-span-2">
        <Image
          fill={false}
          src={`/sprites/${name}.avif`}
          alt={`Sprite of ${name}`}
          height={500}
          width={500}
        />
      </div>

      <div className="col-span-2">
        <div className="text-3xl">Details:</div>
        <PokeDetail name="name">{name}</PokeDetail>
        <PokeDetail name="generation">{generation}</PokeDetail>
        <PokeDetail name="types">
          <div className="flex flex-row gap-4">
            {pokeTypes.map((t) => (
              <PokeTypeTag key={t} pokeType={t} />
            ))}
          </div>
        </PokeDetail>

        <div className="text-3xl">Stats:</div>
        <PokeStat name="hp" value={hp} />
        <PokeStat name="attack" value={attack} />
        <PokeStat name="defense" value={defense} />
        <PokeStat name="spatk" value={spatk} />
        <PokeStat name="spdef" value={spdef} />
        <PokeStat name="speed" value={speed} />
      </div>

      {evolutionBranch && (
        <>
          <div className="text-3xl col-span-full">Evolutions:</div>

          {evolutionBranch.map(
            ({ pokemonId: pokeEvolId, name, type1, type2, generation }) => (
              <Link key={pokeEvolId} href={`/pokemon/${pokeEvolId}`}>
                <PokemonCard
                  name={name}
                  imageSrc={`/sprites/${name}.avif`}
                  imageAlt={`sprite of ${name}`}
                  generation={String(generation)}
                  tags={[...(type1 ? [type1] : []), ...(type2 ? [type2] : [])]}
                  {...(pokeEvolId === pokemonId && {
                    className: "bg-orange-500",
                  })}
                />
              </Link>
            ),
          )}
        </>
      )}
    </>
  );
}

export default PokemonDetails;
