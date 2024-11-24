/*
  Warnings:

  - A unique constraint covering the columns `[evolvedFromId]` on the table `PokemonDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pokemonId,evolutionFamilyId]` on the table `PokemonDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PokemonDetails" ADD COLUMN     "evolutionFamilyId" TEXT,
ADD COLUMN     "evolvedFromId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PokemonDetails_evolvedFromId_key" ON "PokemonDetails"("evolvedFromId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonDetails_pokemonId_evolutionFamilyId_key" ON "PokemonDetails"("pokemonId", "evolutionFamilyId");

-- AddForeignKey
ALTER TABLE "PokemonDetails" ADD CONSTRAINT "PokemonDetails_evolvedFromId_fkey" FOREIGN KEY ("evolvedFromId") REFERENCES "PokemonDetails"("pokemonId") ON DELETE SET NULL ON UPDATE CASCADE;
