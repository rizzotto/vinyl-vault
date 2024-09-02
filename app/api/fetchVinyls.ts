import { useCallback } from "react";
import { useAppContext } from "../context/app_context";

export function useFetchVinyls() {
  const { setLoading, setResults, setTotalPages, setPage, setError } =
    useAppContext();

  const fetchVinyls = useCallback(
    async (query: string, page = 1) => {
      setLoading(true);
      setError("");
      try {
        const searchResponse = await fetch(query);

        if (!searchResponse.ok) {
          throw new Error(`Error: ${searchResponse.statusText}`);
        }

        const searchData = await searchResponse.json();
        setResults(searchData.results);
        setTotalPages(
          Math.min(
            500,
            Math.ceil(
              searchData.pagination.items / searchData.pagination.per_page
            )
          )
        );
        setPage(page);
      } catch (error) {
        setError("Failed to fetch vinyls");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setPage, setResults, setTotalPages]
  );

  return {
    fetchVinyls,
  };
}
