"use client";

import React from "react";
import "./styles.css";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { Input } from "../Input";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../Select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../Form";
import { Button } from "../Button";
import { useAppContext } from "@/app/context/app_context";

async function searchMasterRelease(query: string) {
  try {
    const searchResponse = await fetch(
      `https://api.discogs.com/database/search?q=${encodeURIComponent(
        query
      )}&type=master&format_exact=Vinyl&token=vwWdHlFoJFyjKaIkExbJbrmbRMOmzHyFbmqfWxXC`
    );

    if (!searchResponse.ok) {
      throw new Error(`Error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    return searchData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export function Filters({ id, title }: { id?: string; title?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const { setResults, setLoading } = useAppContext();

  //   useOnClickOutside(ref, () => setOpen(false));

  const formSchema = z.object({
    search: z.string().min(2).max(50),
    genre: z.string().min(2).max(50).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      genre: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const searchData = await searchMasterRelease(values.search);
      setResults(searchData.results);
    } catch (error) {
      console.error("Failed to fetch master release");
    } finally {
      setLoading(false);
      setOpen(false);
    }

    console.log(values);
  }

  return (
    <>
      {/* <div className="fixed bottom-5 right-10 p-4 border rounded-full bg-zinc-800">
        <Search />
      </div> */}
      <motion.button
        onClick={() => {
          setOpen(true);
        }}
        key="button"
        className="fixed bottom-5 right-10 p-4 border bg-gray-300 dark:bg-zinc-800 z-40"
        style={{ borderRadius: 16 }}
        layoutId="wrapper"
      >
        <motion.div layoutId="search">
          <MagnifyingGlassIcon width={24} height={24} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={ref}
            className="filters-popover fixed bottom-5 right-10 z-40 bg-gray-300 dark:bg-zinc-800 p-6 max-w-[280px] md:max-w-[450px]"
            style={{ borderRadius: 16 }}
            layoutId="wrapper"
          >
            <div>
              <Button
                onClick={() => setOpen(false)}
                className="py-2 px-1 h-[24px] bg-transparent absolute top-2 right-2"
                variant="ghost"
              >
                <Cross1Icon />
              </Button>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              autoFocus
                              placeholder="Anything :)"
                              className="pl-8 pr-4 py-2 border rounded-md"
                              {...field}
                            />
                            <motion.div
                              aria-hidden
                              className="absolute inset-y-0 left-0 flex items-center pl-3"
                              layoutId="search"
                            >
                              <MagnifyingGlassIcon />
                            </motion.div>
                          </div>
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Search</Button>
                </form>
              </Form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
