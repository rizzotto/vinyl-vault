"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { TrashBack, TrashFront } from "./trash-assets";
import clsx from "clsx";
import vynil from "@/assets/blonde-vynil.png";
import cover from "@/assets/blonde-cover.jpg";
import { useOnClickOutside } from "usehooks-ts";

export function Animation() {
  const [hover, setHover] = React.useState(false);
  const [click, setClick] = React.useState(false);

  const ref = React.useRef(null);
  useOnClickOutside(ref, () => setClick(false));

  return (
    <div className="flex">
      <div className="relative">
        {/* {hover ? ( */}

        {/* ) : null} */}
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => setClick(true)}
          className="cursor-pointer z-20"
        >
          <motion.img
            layoutId="cover"
            key="first"
            whileHover={{
              scale: 1.1,
            }}
            // className="rounded-md absolute top-0 left-0"
            className="rounded-md"
            src={cover.src}
            alt="floater"
          />
        </div>
        <motion.img
          layoutId="vynil"
          className="absolute h-[20rem] w-[20rem] -z-10"
          // initial={{ x: 0, y: -200, opacity: 0 }}
          // exit={{ x: 0 }}
          // animate={{ x: hover ? 150 : 0, opacity: hover ? 1 : 0 }}
          transition={{
            type: "smooth",
            duration: 0.3,
          }}
          src={vynil.src}
          alt="floater"
        />
      </div>
      {/* <motion.img
        key="second"
        initial={{
          opacity: 1,
        }}
        animate={{
          x: hover ? 180 : 0,
          opacity: hover ? 0.4 : 1,
        }}
        transition={{
          duration: 0.3,
        }}
        whileHover={{
          scale: 1.1,
        }}
        className="rounded-md"
        src={cover.src}
        alt="floater"
      /> */}

      <AnimatePresence>
        {click ? (
          <div className="rounded-sm border border-red-500 absolute inset-0 z-10 flex items-center justify-center">
            <div ref={ref} className="flex h-fit w-[500px]  overflow-hidden">
              <motion.img
                width={100}
                height={100}
                layoutId="cover"
                src={cover.src}
              />
              <div className="text-lg">Blonde</div>
              <ul>
                <li>Song 1</li>
                <li>Song 2</li>
                <li>Song 3</li>
                <li>Song 4</li>
              </ul>
              {/* <motion.img layoutId="vynil" src={vynil.src} /> */}
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
