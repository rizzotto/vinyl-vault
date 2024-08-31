"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import vynil from "@/assets/blonde-vynil.png";
import { useOnClickOutside } from "usehooks-ts";
import "./styles.css";
import { StaticImageData } from "next/image";
import { useAppContext } from "@/app/context/app_context";

export function Vinyl({
  id,
  cover,
  title,
}: {
  id: string;
  title: string;
  cover: StaticImageData;
}) {
  const [hover, setHover] = React.useState(false);
  const [click, setClick] = React.useState(false);

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
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <motion.div
              key={`${id}-selected`}
              layoutId={`${id}-inner`}
              ref={ref}
              className="relative flex h-fit flex-col overflow-hidden bg-slate-600 p-8 min-w-96 items-center gap-6"
              style={{ borderRadius: 12 }}
            >
              <motion.img
                className="rounded-md h-[200px] w-[200px]"
                layoutId={`${id}-cover`}
                src={cover}
              />

              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="w-full text-slate-100"
              >
                <h3 className="text-3xl font-bold">{title}</h3>
                <ul>
                  <li>Song 1</li>
                  <li>Song 2</li>
                  <li>Song 3</li>
                  <li>Song 4</li>
                </ul>
              </motion.div>
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
            {/* {hover ? ( */}

            {/* ) : null} */}
            <button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => setClick(true)}
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
