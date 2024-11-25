"use client";

import { useState } from "react";
import {
  SearchBar,
  SearchInput,
  MultiSelectDropdown,
} from "@/components/search";
import { PokemonType } from "@prisma/client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { POKEMON_GENERATIONS, PokemonGeneration } from "@/db/pokemon";

const TYPING_DEBOUNCE = 500;

interface SearchForm {
  searchItem?: string;
  typeFilter?: PokemonType[];
  generationFilter?: PokemonGeneration[];
}

export const SearchBarConnected = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchForm, setSearchForm] = useState<SearchForm>({});

  const syncUrlState = (form: SearchForm) => {
    const params = new URLSearchParams(searchParams);

    const { searchItem, typeFilter, generationFilter } = form;

    if (searchItem) params.set("search", searchItem);
    else params.delete("search");

    if (typeFilter && typeFilter.length > 0)
      params.set("types", JSON.stringify(typeFilter));
    else params.delete("types");

    if (generationFilter && generationFilter.length > 0)
      params.set("generations", JSON.stringify(generationFilter));
    else params.delete("generations");

    replace(`${pathname}?${params.toString()}`);
  };

  const debouncedSyncUrl = useDebouncedCallback(syncUrlState, TYPING_DEBOUNCE);

  const setForm = (form: SearchForm) => {
    setSearchForm(form);
    debouncedSyncUrl(form);
  };

  const onTypeSearchItem = (s: string) => {
    setForm({ ...searchForm, searchItem: s });
  };

  const toggleTypeFilter = (t: PokemonType) => {
    const { typeFilter } = searchForm;
    if (!typeFilter) {
      setForm({
        ...searchForm,
        typeFilter: [t],
      });
      return;
    }
    if (typeFilter.includes(t)) {
      setForm({
        ...searchForm,
        typeFilter: [...typeFilter.filter((t_) => t_ !== t)],
      });
      return;
    }
    setForm({
      ...searchForm,
      typeFilter: [...typeFilter, t],
    });
  };

  const togglePokemonGeneration = (t: PokemonGeneration) => {
    const { generationFilter } = searchForm;
    if (!generationFilter) {
      setForm({
        ...searchForm,
        generationFilter: [t],
      });
      return;
    }
    if (generationFilter.includes(t)) {
      setForm({
        ...searchForm,
        generationFilter: [...generationFilter.filter((t_) => t_ !== t)],
      });
      return;
    }
    setForm({
      ...searchForm,
      generationFilter: [...generationFilter, t],
    });
  };

  return (
    <SearchBar>
      <SearchInput
        searchItem={searchForm.searchItem ?? ""}
        setSearchItem={onTypeSearchItem}
      />
      <MultiSelectDropdown
        label="type filter"
        options={Object.values(PokemonType)}
        onClick={toggleTypeFilter}
        checkedOptions={searchForm.typeFilter ?? []}
      />

      <MultiSelectDropdown
        label="multigeneration filter"
        options={POKEMON_GENERATIONS}
        onClick={togglePokemonGeneration}
        checkedOptions={searchForm.generationFilter ?? []}
      />
    </SearchBar>
  );
};
