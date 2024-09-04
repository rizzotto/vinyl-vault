"use client";

import { Vinyl } from "../Vinyl";
import React from "react";
import { useAppContext } from "@/app/context/app_context";
import { Skeleton } from "../Skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { playfair } from "@/app/fonts";
import { Player } from "@lottiefiles/react-lottie-player";
import { useTheme } from "next-themes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../Pagination";
import { useFetchVinyls } from "@/app/api/fetchVinyls";

export default function VinylList() {
  const { results, loading, page, setPage, totalPages, filters, error } =
    useAppContext();

  const { theme } = useTheme();

  const { fetchVinyls } = useFetchVinyls();

  const filtersQuery = (newPage = 1) =>
    `https://api.discogs.com/database/search?${
      filters.vinyl ? `q=${encodeURIComponent(filters.vinyl)}` : ""
    }${filters.artist ? `q=${encodeURIComponent(filters.artist)}` : ""}${
      filters.genre ? `&genre=${encodeURIComponent(filters.genre)}` : ""
    }&format=Vinyl&token=${
      process.env.NEXT_PUBLIC_DISCOGS_API_TOKEN
    }&page=${newPage}&per_page=50`;

  const query = (newPage = 1) =>
    `https://api.discogs.com/database/search?type=master&sort=have&sort_order=desc&genre=Hip%20Hop&token=${process.env.NEXT_PUBLIC_DISCOGS_API_TOKEN}&format=Vinyl&page=${newPage}&per_page=20`;

  React.useEffect(() => {
    handlePageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function handlePageChange(newPage = 1) {
    setPage(newPage);
    await fetchVinyls(
      filters.vinyl !== undefined ||
        filters.genre !== undefined ||
        filters.artist !== undefined
        ? filtersQuery(newPage)
        : query(newPage),
      newPage
    );
  }

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === page - 2 || i === page + 2) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return (
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(page - 1)}
          />
        </PaginationItem>
        {pages}
        <PaginationItem>
          <PaginationNext href="#" onClick={() => handlePageChange(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    );
  };

  const skeletons = Array.from({ length: 20 }).map((_, index) => (
    <div key={index} className="flex flex-col space-y-3">
      <Skeleton className="h-[320px] w-[320px] rounded-xl" />
    </div>
  ));

  const filteredResults = results
    ? results.filter(
        (result, index, self) =>
          index === self.findIndex((r) => r.master_id === result.master_id)
      )
    : [];

  return (
    <>
      {results && results.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full gap-12 mt-16">
          <div
            className={cn(
              playfair.className,
              "text-4xl text-vinyl-100 dark:text-vinyl-300"
            )}
          >
            No Vinyls found
          </div>
          <Player
            autoplay
            loop
            src={
              theme === "light"
                ? "https://lottie.host/469cbc00-4580-4915-bc84-4aed9b3d3f4c/ciKsxlehXN.json"
                : "https://lottie.host/8b927710-4c1d-4bd0-8d96-e2a2612791df/Uqbt2oPK1e.json"
            }
            className="h-60 w-60 md:h-[500px] md:w-[500px]"
          />
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results && (
        <>
          <div className="gap-8 items-center place-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  overflow-x-hidden py-8 scrollbar-thumb-rounded-full scrollbar scrollbar-thumb-vinyl-100 dark:scrollbar-thumb-vinyl-300  overflow-y-scroll bg-vinyl-300 dark:bg-vinyl-100">
            {loading
              ? skeletons
              : filteredResults.map((result, index) => {
                  const [artist, title] = result.title.split("-");
                  return (
                    <motion.div
                      key={result.master_id}
                      initial={{ opacity: 0, y: index * 10 }}
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
                        formats={result.format}
                      />
                    </motion.div>
                  );
                })}
          </div>
          {results.length > 0 && (
            <Pagination className="my-1">{renderPagination()}</Pagination>
          )}
        </>
      )}
    </>
  );
}
