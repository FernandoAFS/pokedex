"use server";

import { PokemonCard } from "@/components/pokeCard";
import { getAllPokemon, type PokemonGeneration } from "@/db/pokemon";
import { SearchBarConnected } from "@/app/clientComponents/search";
import type { PokemonType } from "@prisma/client";
import Link from "next/link";
import { ThikArrowLeft, ThikArrowRight } from "@/components/icons";
// 3 FULL ROWS OF 4 CARDS EACH
const ITEMS_PER_PAGE = 12;

// OVERFETCHING 1 ITEM SO THAT WE KNOW IF THIS IS THE LAST PAGE.
const TAKE = ITEMS_PER_PAGE + 1;

const parseJsonSearchParam = (s: string | undefined): string[] | undefined => {
  if (!s) return;
  return JSON.parse(s);
};

async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // , take, skip
  const params = await searchParams;
  const {
    search,
    types: typesJson,
    generations: generationsJson,
    page: pageParam,
  } = params;
  const typeFilter = parseJsonSearchParam(typesJson as string);
  const generationFilter = parseJsonSearchParam(generationsJson as string);

  const page = Number(pageParam) || 0; // PAGES ARE 0 BASED...

  const allPokemon = await getAllPokemon({
    take: TAKE,
    skip: ITEMS_PER_PAGE * page,
    searchTerm: search as string,
    ...(typeFilter && { typeFilter: typeFilter as PokemonType[] }),
    ...(generationFilter && {
      generationFilter: generationFilter as PokemonGeneration[],
    }),
  });

  const getPreviousPageUri = () => {
    if (page <= 0) return "#";
    const nextParams = new URLSearchParams({
      ...params,
      page: String(page - 1),
    });
    return `/?${nextParams.toString()}`;
  };

  const getNextPageUri = () => {
    if (allPokemon.length < TAKE) return "#";

    const nextParams = new URLSearchParams({
      ...params,
      page: String(page + 1),
    });

    return `/?${nextParams.toString()}`;
  };

  return (
    <>
      <div className="col-span-full">
        <SearchBarConnected />
      </div>
      {allPokemon
        .slice(0, ITEMS_PER_PAGE)
        .map(({ pokemonId, name, type1, type2, generation }) => (
          <Link key={pokemonId} href={`/pokemon/${pokemonId}`}>
            <PokemonCard
              name={name}
              imageSrc={`/sprites/${name}.avif`}
              imageAlt={`sprite of ${name}`}
              generation={String(generation)}
              tags={[...(type1 ? [type1] : []), ...(type2 ? [type2] : [])]}
            />
          </Link>
        ))}
      <div className="col-span-full h-8 flex flex-row justify-between container mx-auto">
        <Link href={getPreviousPageUri()}>
          <div className="h-12 w-12">
            <ThikArrowLeft />
          </div>
        </Link>
        <Link href={getNextPageUri()}>
          <div className="h-12 w-12">
            <ThikArrowRight />
          </div>
        </Link>
      </div>
    </>
  );
}

export default Home;
