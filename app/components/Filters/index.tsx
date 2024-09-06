"use client";

import React from "react";
import "./styles.css";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../Input";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { isMobile } from "react-device-detect";
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

export function Filters() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const { setLoading, setFilters } = useAppContext();

  //   useOnClickOutside(ref, () => setOpen(false));

  const formSchema = z.object({
    artist: z.string().min(2).max(50).optional(),
    genre: z.string().min(2).max(50).optional(),
    vinyl: z.string().min(2).max(50).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artist: undefined,
      vinyl: undefined,
      genre: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    setFilters({
      vinyl: values.vinyl,
      artist: values.artist,
      genre: values.genre === "none" ? undefined : values.genre,
    });

    setOpen(false);
    form.reset();
  }

  return (
    <>
      <motion.button
        onClick={() => {
          setOpen(true);
        }}
        whileTap={{
          scale: 0.9,
        }}
        key="button"
        className="fixed bottom-5 right-10 p-4 border-vinyl-100 dark:border-vinyl-300 bg-vinyl-300 dark:bg-vinyl-100 text-vinyl-100 dark:text-vinyl-300  z-30"
        style={{
          borderRadius: 16,
          borderWidth: 1,
        }}
        layoutId="wrapper"
      >
        <motion.div layoutId="vinyl">
          <MagnifyingGlassIcon width={24} height={24} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={ref}
            className="filters-popover fixed bottom-0 right-0 md:bottom-5 md:right-10 z-40 border-vinyl-100 dark:border-vinyl-300 bg-vinyl-300 dark:bg-vinyl-100 text-vinyl-100 dark:text-vinyl-300  p-6  md:max-w-[450px]"
            style={{
              borderRadius: 16,
              borderWidth: 1,
            }}
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
                  className="space-y-4 flex flex-col"
                >
                  <FormField
                    control={form.control}
                    name="vinyl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vinyl</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              autoFocus={!isMobile}
                              placeholder="Blonde"
                              className="pl-8 pr-4 py-2 border rounded-md placeholder:text-vinyl-100/60 dark:placeholder:text-vinyl-300/60 dark:text-vinyl-300"
                              {...field}
                            />
                            <motion.div
                              aria-hidden
                              className="absolute inset-y-0 left-0 flex items-center pl-3"
                              layoutId="vinyl"
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
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Frank Ocean :)"
                              className="py-2 border rounded-md placeholder:text-vinyl-100/60 dark:placeholder:text-vinyl-300/60 dark:text-vinyl-300"
                              {...field}
                            />
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
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                            <SelectItem value="Pop">Pop</SelectItem>
                            <SelectItem value="Blues">Blues</SelectItem>
                            <SelectItem value="Jazz">Jazz</SelectItem>
                            <SelectItem value="Reggae">Reggae</SelectItem>
                            <SelectItem value="Classical">Classical</SelectItem>
                            <SelectItem value="Latin">Latin</SelectItem>
                            <SelectItem value="Folk, World & Country">
                              Folk, World & Country
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
