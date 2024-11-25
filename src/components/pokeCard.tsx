import Image from "next/image";

export interface PokemonCardProps {
  name: string;
  imageSrc: string;
  imageAlt: string;
  generation: string;
  tags?: string[];
  className?: string;
}

export const PokemonCard = ({
  name,
  imageSrc,
  tags,
  imageAlt,
  generation,
  className,
}: PokemonCardProps) => (
  // Source: https://v1.tailwindcss.com/components/cards
  //
  <div className={`max-w-sm rounded overflow-hidden shadow-lg ${className}`}>
    <Image
      className="w-full"
      src={imageSrc}
      alt={imageAlt}
      height={500}
      width={500}
    />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{name}</div>
    </div>
    <p className="text-gray-700 text-base">generation: {generation}</p>
    {tags && (
      <div className="px-6 pt-4 pb-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {t}
          </span>
        ))}
      </div>
    )}
  </div>
);

/*
<p className="text-gray-700 text-base">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
</p>
 */
