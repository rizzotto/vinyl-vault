"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import vynil from "@/assets/blonde-vynil.png";
import { useOnClickOutside } from "usehooks-ts";
import "./styles.css";
import { StaticImageData } from "next/image";
import { useAppContext } from "@/app/context/app_context";
import { Skeleton } from "../Skeleton";
import { cn } from "@/lib/utils";
import { Separator } from "../Separator";
import { Badge } from "../Badge";
import { Spotify } from "react-spotify-embed";
import { ScrollArea } from "../ScrollArea";

const encodedCredentials = btoa(
  `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
);

export function Vinyl({
  id,
  cover,
  title,
  artist,
  country,
  genre,
  year,
}: {
  artist: string;
  id: string;
  title: string;
  cover: StaticImageData;
  country: string;
  genre: [];
  year: string;
}) {
  const [hover, setHover] = React.useState(false);
  const [click, setClick] = React.useState(false);

  const [content, setContent] = React.useState([]);
  const [loadContent, setLoadContent] = React.useState(false);

  const [lala, setLala] = React.useState(null);

  const { loading } = useAppContext();

  const ref = React.useRef(null);
  useOnClickOutside(ref, () => {
    setClick(false);
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setClick(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [click]);

  if (loading) return null;

  async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token; // Use this token in your API requests
  }

  async function searchSpotifyAlbum() {
    const token = await getAccessToken();
    const query = `album:${encodeURIComponent(
      title
    )} artist:${encodeURIComponent(artist)}`;
    const url = `https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.albums.items.length > 0) {
        // console.log(data.albums.items[0]);
        setLala(data.albums.items[0].external_urls.spotify); // Return the first matching album
      }

      return null; // No album found
    } catch (error) {
      console.error("Error searching Spotify:", error);
      throw error;
    }
  }

  const fetchTrendingReleases = async () => {
    setLoadContent(true);
    try {
      const searchResponse = await fetch(
        `https://api.discogs.com/masters/${id}`
      );

      if (!searchResponse.ok) {
        throw new Error(`Error: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      setContent(searchData);
    } catch (error) {
      // setError("Failed to fetch trending releases");
    } finally {
      setLoadContent(false);
    }
  };

  async function handleCoverClick() {
    fetchTrendingReleases();
    searchSpotifyAlbum();
    setClick(true);
  }

  return (
    <>
      <AnimatePresence>
        {click ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overlay"
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {click ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center text-slate-400">
            <motion.div
              key={`${id}-selected`}
              layoutId={`${id}-inner`}
              ref={ref}
              className="inner relative flex h-fit flex-col overflow-hidden bg-slate-600 p-8 min-w-[400px] items-start gap-4"
              style={{ borderRadius: 12 }}
            >
              <div className="flex items-start w-full gap-4">
                <motion.img
                  className="rounded-md h-[200px] w-[200px]"
                  layoutId={`${id}-cover`}
                  src={cover}
                />
                <div>
                  <div>
                    <div>Year</div>
                    <Badge>{year}</Badge>
                  </div>
                  <div>
                    <div>Country</div>
                    <Badge>{country}</Badge>
                  </div>
                </div>
              </div>
              <ul className="flex gap-2">
                {genre.map((g) => (
                  <Badge variant="outline">{g}</Badge>
                ))}
              </ul>

              <h3 className="text-3xl font-bold">{title}</h3>
              <h5>{artist}</h5>
              {loadContent ? (
                <Skeleton className="h-[200px] w-[90%] rounded-xl" />
              ) : (
                <>
                  <Separator />
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {content.tracklist.map((t) => (
                        <div className="flex justify-between">
                          <div
                            className={cn(
                              t.type_ === "heading" && "font-bold bg-black"
                            )}
                          >
                            {t.title}
                          </div>
                          <div>{t.duration}</div>
                        </div>
                      ))}
                    </ul>
                  </ScrollArea>
                </>
              )}
              {!lala ? (
                <Skeleton className="h-[136px] w-[100%px] rounded-xl" />
              ) : (
                <Spotify wide width="100%" link={lala} />
              )}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="flex">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${id}-wrapper`}
            layoutId={`${id}-inner`}
            className="relative"
          >
            <button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={handleCoverClick}
              className="cursor-pointer"
              style={{ position: "relative", zIndex: 20 }}
            >
              <div className="absolute h-8 w-6 bg-yellow-950 z-40 -bottom-1 left-10 rounded-sm" />
              <div className="absolute h-8 w-6 bg-yellow-950 z-40 -bottom-1 right-10 rounded-sm" />
              <motion.img
                layoutId={`${id}-cover`}
                whileHover={{
                  scale: 0.98,
                }}
                className="rounded-md h-[300px] w-[300px] shadow-lg "
                src={cover}
                alt="floater"
              />
            </button>
            <motion.img
              style={{ position: "absolute", zIndex: 10 }}
              className="h-[320px] w-[320px]"
              initial={{ y: -315, opacity: 0 }}
              animate={
                click
                  ? { x: 0 }
                  : { x: hover ? 130 : 0, opacity: hover ? 1 : 0 }
              }
              transition={{
                type: "smooth",
                duration: 0.3,
              }}
              src={vynil.src}
              alt="floater"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
