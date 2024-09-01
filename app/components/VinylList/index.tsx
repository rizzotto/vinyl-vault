"use client";

import wall from "@/assets/wall.jpg";
import blonde from "@/assets/blonde-cover.jpg";
import flower from "@/assets/flower.jpg";
import sos from "@/assets/sos.jpg";
import { Vinyl } from "../Vinyl";
import fetchPopularAlbums from "@/api/popularAlbums";
import React from "react";
import { Filters } from "../Filters";
import { useAppContext } from "@/app/context/app_context";
import { Skeleton } from "../Skeleton";
import { ScrollArea } from "../ScrollArea";
import { motion } from "framer-motion";
// import fetchPopularAlbums from "@/api/popularAlbums";

export default function VinylList() {
  const [query, setQuery] = React.useState(""); // Single input for both album and artist
  const [error, setError] = React.useState("");

  const { results, setResults, loading, setLoading } = useAppContext();

  React.useEffect(() => {
    const fetchTrendingReleases = async () => {
      setLoading(true);
      setError("");
      try {
        const searchResponse = await fetch(
          `https://api.discogs.com/database/search?type=master&sort=have&sort_order=desc&genre=Hip%20Hop&token=${process.env.NEXT_PUBLIC_DISCOGS_API_TOKEN}&format=Vinyl`
        );

        if (!searchResponse.ok) {
          throw new Error(`Error: ${searchResponse.statusText}`);
        }

        const searchData = await searchResponse.json();
        setResults(searchData.results);
      } catch (error) {
        setError("Failed to fetch trending releases");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingReleases();
  }, []);

  const skeletons = Array.from({ length: 20 }).map((_, index) => (
    <div key={index} className="flex flex-col space-y-3">
      <Skeleton className="h-[320px] w-[320px] rounded-xl" />
      {/* <div className="space-y-2">
        <Skeleton className="h-4 w-[320px]" />
      </div> */}
    </div>
  ));

  return (
    <div className="gap-8 items-center place-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  overflow-x-hidden py-8 scrollbar-thumb-rounded-full scrollbar scrollbar-thumb-vinyl-100  overflow-y-scroll">
      {loading && skeletons}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results &&
        results.map((result, index) => {
          const [artist, title] = result.title.split("-");
          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: Math.random() * 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Vinyl
                id={result.master_id}
                cover={result.cover_image}
                title={title}
                artist={artist}
                country={result.country}
                genre={result.genre}
                year={result.year}
                key={result.master_id}
              />
            </motion.div>
          );
        })}
    </div>
  );
}
