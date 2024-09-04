"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import vinyl from "@/assets/vinyl.png";
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
import { Button } from "../Button";
import { Cross1Icon } from "@radix-ui/react-icons";

const encodedCredentials = btoa(
  `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
);

type VinylType = {
  tracklist: [
    {
      position: string;
      duration: string;
      title: string;
      type_: string;
      extraartists: {
        anv: string;
        id: number;
        join: string;
        name: string;
        resource_url: string;
        role: string;
        tracks: string;
      };
    }
  ];
  videos: [
    {
      description: string;
      duration: number;
      embed: boolean;
      title: string;
      uri: string;
    }
  ];
};

export function Vinyl({
  artist,
  country,
  cover,
  formats,
  genre,
  id,
  title,
  year,
  ...rest
}: {
  artist: string;
  id: string;
  title: string;
  cover: string;
  country: string;
  formats: [];
  genre: [];
  year: string;
}) {
  const [hover, setHover] = React.useState(false);
  const [click, setClick] = React.useState(false);

  const [content, setContent] = React.useState<VinylType | null>(null);
  const [loadContent, setLoadContent] = React.useState(false);

  const [spotify, setSpotify] = React.useState<string | null>(null);

  const { loading } = useAppContext();

  const ref = React.useRef(null);
  useOnClickOutside(ref, () => {
    setClick(false);
  });

  // console.log(content);

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
    return data.access_token;
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
        setSpotify(data.albums.items[0].external_urls.spotify);
      } else {
        setSpotify("none");
      }

      return null;
    } catch (error) {
      console.error("Error searching Spotify:", error);
      throw error;
    }
  }

  const fetchVinyl = async () => {
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
    if (!content) {
      fetchVinyl();
      searchSpotifyAlbum();
    }
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
          <div className="absolute inset-0 z-30 flex items-center justify-center text-vinyl-300 dark:text-vinyl-100">
            <motion.div
              key={`${id}-selected`}
              layoutId={`${id}-inner`}
              ref={ref}
              className="inner relative overflow-auto flex h-fit flex-col max-h-[95vh] bg-vinyl-100 dark:bg-vinyl-300 p-4 md:p-8 w-full m-2 min-w-[200px] md:min-w-[400px] max-w-[530px] items-start gap-4"
              style={{ borderRadius: 12 }}
            >
              <Button
                onClick={() => setClick(false)}
                className="py-2 px-1 h-[24px] bg-transparent absolute top-2 right-2"
                variant="ghost"
              >
                <Cross1Icon />
              </Button>
              <div className="flex items-start w-full gap-4">
                <motion.img
                  className="rounded-md h-[200px] w-[200px]"
                  layoutId={`${id}-cover`}
                  src={cover}
                />
                <div className="flex flex-col gap-1">
                  <div>
                    <div>Year</div>
                    <Badge>{year}</Badge>
                  </div>
                  <div>
                    <div>Country</div>
                    <Badge>{country}</Badge>
                  </div>
                  <div>Genres</div>
                  <ul className="flex flex-wrap gap-2">
                    {genre.map((g, i) => (
                      <li key={`${g}-${i}`} className="flex-shrink-0">
                        <Badge>{g}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <ul className="flex gap-1 items-start">
                {formats.map((format) => (
                  <Badge variant="outline" key={format}>
                    {format}
                  </Badge>
                ))}
              </ul>

              <div>
                <h3 className="text-3xl font-bold">{title}</h3>
                <h5>{artist}</h5>
              </div>
              {!loadContent && content && content.tracklist ? (
                <>
                  <Separator />
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {content.tracklist.map((t, i) => (
                        <div
                          key={`${t}-${i}`}
                          className="flex justify-between my-2 mr-3"
                        >
                          <div
                            className={cn(
                              t.type_ === "heading" &&
                                "font-bold bg-vinyl-200 w-full p-1 rounded-md"
                            )}
                          >
                            {t.title}
                          </div>
                          <div>{t.position}</div>
                        </div>
                      ))}
                    </ul>
                  </ScrollArea>
                </>
              ) : (
                <Skeleton className="h-[220px] w-[100%] rounded-xl" />
              )}
              {spotify === "none" ? (
                <></>
              ) : spotify === null ? (
                <Skeleton className="h-[80px] w-[100%px] rounded-xl" />
              ) : (
                <Spotify wide width="100%" link={spotify} />
              )}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div id={id} className="flex" {...rest}>
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
              src={vinyl.src}
              alt="floater"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
