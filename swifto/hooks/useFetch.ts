"use client"

import { useEffect, useState } from "react";

const APIKEY = process.env.NEXT_PUBLIC_GIPHY_API as string | undefined;

interface UseFetchProps {
  keyword: string;
}

const FALLBACK_GIF =
  "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284";

const useFetch = ({ keyword }: UseFetchProps): string => {
  const [gifUrl, setGifUrl] = useState("");

  useEffect(() => {
    if (!keyword) return;

    const fetchGifs = async () => {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${keyword
            .split(" ")
            .join("")}&limit=1`
        );
        const { data } = await response.json();
        setGifUrl(data[0]?.images?.downsized_medium?.url ?? FALLBACK_GIF);
      } catch {
        setGifUrl(FALLBACK_GIF);
      }
    };

    void fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;