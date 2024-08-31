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
// import fetchPopularAlbums from "@/api/popularAlbums";

export default function VinylList() {
  const [query, setQuery] = React.useState(""); // Single input for both album and artist
  const [error, setError] = React.useState("");

  const { results, setResults, loading, setLoading } = useAppContext();

  const YOUR_DISCOGS_TOKEN = process.env.NEXT_PUBLIC_DISCOGS_TOKEN;

  React.useEffect(() => {
    const fetchTrendingReleases = async () => {
      setLoading(true);
      setError("");
      try {
        const searchResponse = await fetch(
          `https://api.discogs.com/database/search?type=master&sort=have&sort_order=desc&genre=Hip%20Hop&format_exact=Vinyl&token=vwWdHlFoJFyjKaIkExbJbrmbRMOmzHyFbmqfWxXC`
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
    <div className="gap-8 items-center place-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  overflow-x-hidden py-8">
      {loading && skeletons}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results &&
        results.map((result) => (
          <Vinyl
            id={result.id}
            cover={result.cover_image}
            title={result.title.split("-")[1]}
          />
        ))}
    </div>
  );
}
