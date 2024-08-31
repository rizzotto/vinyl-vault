import type { NextApiRequest, NextApiResponse } from "next";

type Album = {
  id: number;
  title: string;
  artist: string;
  cover_image: string;
};

export default async function fetchPopularAlbums() {
  const { API_TOKEN } = process.env;

  const url = `https://api.discogs.com/database/search?token=${API_TOKEN}&type=master&sort=hot`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch popular albums");
  }

  //   const data = await res.json();

  //   const albums: Album[] = data.results.map((item: any) => ({
  //     id: item.id,
  //     title: item.title,
  //     artist: item.artist,
  //     cover: item.cover_image,
  //   }));

  return res.json();
}
