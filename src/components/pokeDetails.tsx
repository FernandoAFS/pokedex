import React from "react";

export interface PokeStatProps {
  name: string;
  value: number;
}

const valueColorCssClass = (value: number) => {
  if (value < 50) return "bg-red-500";
  if (value < 75) return "bg-yellow-500";
  return "bg-green-500";
};

export const PokeStat = ({ name, value }: PokeStatProps) => {
  const color = valueColorCssClass(value);
  return (
    <div className="flex flex-row w-full h-6">
      <div className="w-24">{name}</div>
      <div className="w-12">{value}</div>
      <div className="grow">
        <div
          className={`h-4 rounded-md ${color}`}
          style={{ width: `${(value * 100) / 255}%` }}
        />
      </div>
    </div>
  );
};

type PokeType =
  | "NORMAL"
  | "FIRE"
  | "WATER"
  | "ELECTRIC"
  | "GRASS"
  | "ICE"
  | "FIGHTING"
  | "POISON"
  | "GROUND"
  | "FLYING"
  | "PSYCHIC"
  | "BUG"
  | "ROCK"
  | "GHOST"
  | "DRAGON"
  | "DARK"
  | "STEEL"
  | "FAIRY";

const pokeTypetoColor = (pokeType: PokeType): string => {
  switch (pokeType) {
    case "NORMAL":
      return "#aa9";
    case "FIRE":
      return "#f24";
    case "WATER":
      return "#39f";
    case "ELECTRIC":
      return "#fc3";
    case "GRASS":
      return "#7c5";
    case "ICE":
      return "#6cf";
    case "FIGHTING":
      return "#b54";
    case "POISON":
      return "#a59";
    case "GROUND":
      return "#db5";
    case "FLYING":
      return "#89f";
    case "PSYCHIC":
      return "#f59";
    case "BUG":
      return "#ab2";
    case "ROCK":
      return "#ba6";
    case "GHOST":
      return "#66b";
    case "DRAGON":
      return "#76e";
    case "DARK":
      return "#754";
    case "STEEL":
      return "#aab";
    case "FAIRY":
      return "#e9e";
  }
};

export interface PokeTypeTagProps {
  pokeType: PokeType;
}

export const PokeTypeTag = ({ pokeType }: PokeTypeTagProps) => {
  const color = pokeTypetoColor(pokeType);
  return (
    <div
      className="h-8 w-24 p-2 flex justify-center align-middle text-center rounded-md text-white"
      style={{ background: color }}
    >
      <div>{pokeType}</div>
    </div>
  );
};

export interface PokeDetailProps extends React.PropsWithChildren {
  name: string;
}

export const PokeDetail = ({ name, children }: PokeDetailProps) => (
  <div className="flex flex-row min-h-8 align-middle">
    <div className="w-48">{name}</div>
    <div>{children}</div>
  </div>
);
