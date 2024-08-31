import wall from "@/assets/wall.jpg";
import blonde from "@/assets/blonde-cover.jpg";
import flower from "@/assets/flower.jpg";
import sos from "@/assets/sos.jpg";
import VinylList from "./components/VinylList";
import { Filters } from "./components/Filters";
import { AppContextProvider } from "./context/app_context";
import { playfair } from "./fonts";
import { cn } from "@/lib/utils";
// import fetchPopularAlbums from "@/api/popularAlbums";

async function fetchPosts() {
  const res = await fetch("https://api.example.com/posts");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Home() {
  return (
    <AppContextProvider>
      <div
        style={{
          backgroundImage: `url(${wall.src})`,
          backgroundRepeat: "repeat",
          overflow: "auto",
        }}
        className="h-screen relative flex flex-col"
      >
        {/* <div
          className={cn(
            playfair.className,
            "font-extrabold text-3xl text-red-700 tracking-wider px-12 py-4"
          )}
        >
          Vinyl Vault
        </div> */}
        <Filters />
        <VinylList />
      </div>
    </AppContextProvider>
  );
}
