-- CreateEnum
CREATE TYPE "PokemonType" AS ENUM ('NORMAL', 'FIRE', 'WATER', 'ELECTRIC', 'GRASS', 'ICE', 'FIGHTING', 'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG', 'ROCK', 'GHOST', 'DRAGON', 'DARK', 'STEEL', 'FAIRY');

-- CreateTable
CREATE TABLE "PokemonDetails" (
    "pokemonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type1" "PokemonType" NOT NULL,
    "type2" "PokemonType",
    "generation" INTEGER NOT NULL,
    "hp" DOUBLE PRECISION NOT NULL,
    "attack" DOUBLE PRECISION NOT NULL,
    "defense" DOUBLE PRECISION NOT NULL,
    "spatk" DOUBLE PRECISION NOT NULL,
    "spdef" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PokemonDetails_pkey" PRIMARY KEY ("pokemonId")
);
