import prisma from "./index";
import { PokemonType } from "@prisma/client";

export const POKEMON_GENERATIONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;
export type PokemonGeneration = (typeof POKEMON_GENERATIONS)[number];

export interface getAllPokemonProps {
  searchTerm?: string;
  typeFilter?: PokemonType[];
  generationFilter?: PokemonGeneration[];
  skip?: number;
  take?: number;
}

export async function getAllPokemon({
  searchTerm,
  typeFilter,
  generationFilter,
  skip = 0,
  take = 10,
}: getAllPokemonProps) {
  const wherePredicate = {
    ...(typeFilter &&
      typeFilter.length > 0 && {
        OR: [
          {
            type1: {
              in: typeFilter,
            },
          },
          {
            type2: {
              in: typeFilter,
            },
          },
        ],
      }),
    ...(generationFilter &&
      generationFilter.length > 0 && {
        generation: {
          in: generationFilter.map(Number),
        },
      }),
  };

  const pokemonResult = await prisma.pokemonDetails.findMany({
    where: {
      ...(searchTerm && {
        name: {
          contains: searchTerm,
        },
      }),
      ...wherePredicate,
    },
    orderBy: {
      generation: "asc",
    },
  });

  return await prisma.pokemonDetails.findMany({
    skip,
    take,
    where: {
      ...wherePredicate,
      evolutionFamilyId: {
        in: pokemonResult
          .map((p) => p.evolutionFamilyId)
          .filter((s): s is string => !!s),
      },
    },
    orderBy: {
      generation: "asc",
    },
  });
}

export interface getPokemonByUuid {
  uuid: string;
}

export async function getPokemonByUuid({ uuid }: getPokemonByUuid) {
  const pokemon = await prisma.pokemonDetails.findUnique({
    where: {
      pokemonId: uuid,
    },
    include: {
      evolvesTo: true,
      evolvedFrom: true,
    },
  });

  if (!pokemon) return;

  const evolutionBranch = await prisma.pokemonDetails.findMany({
    where: {
      evolutionFamilyId: pokemon?.evolutionFamilyId,
    },
    include: {
      evolvedFrom: true,
    },
  });

  if (!evolutionBranch) return { pokemon };

  type PokemonType = (typeof evolutionBranch)[number];

  function* recurse(p: PokemonType): Generator<PokemonType> {
    yield p;
    const next = evolutionBranch.find(
      (next) => next.evolvedFrom?.pokemonId === p.pokemonId,
    );
    if (!next) return;
    yield* recurse(next);
  }

  const sortedEvolutionBranch = evolutionBranch
    .filter((p) => !p.evolvedFrom)
    .flatMap((p) => [...recurse(p)]);

  if (sortedEvolutionBranch.length <= 0) {
    console.warn(
      `Detected branch with no beginning at pokemon ${pokemon.pokemonId}. Returning with no sort...`,
    );
    return {
      pokemon,
      evolutionBranch,
    };
  }

  return {
    pokemon,
    evolutionBranch: sortedEvolutionBranch,
  };
}
