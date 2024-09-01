import wall from "@/assets/wall.jpg";
import blonde from "@/assets/blonde-cover.jpg";
import flower from "@/assets/flower.jpg";
import sos from "@/assets/sos.jpg";
import VinylList from "./components/VinylList";
import { Filters } from "./components/Filters";
import { AppContextProvider } from "./context/app_context";
import { playfair } from "./fonts";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./components/DropdownMenu";

export default function Home() {
  return (
    <AppContextProvider>
      <div
        style={
          {
            // backgroundImage: `url(${wall.src})`,
            // backgroundRepeat: "repeat",
            // overflow: "auto",
          }
        }
        className="h-screen relative flex flex-col bg-vinyl-300 dark:bg-vinyl-100"
      >
        <div
          className={cn(
            playfair.className,
            "flex justify-between font-extrabold text-3xl text-vinyl-100 dark:text-vinyl-300 tracking-wider px-12 py-4"
          )}
        >
          <div>Vinyl Vault</div>
          <ModeToggle />
        </div>
        <Filters />
        <VinylList />
      </div>
    </AppContextProvider>
  );
}
