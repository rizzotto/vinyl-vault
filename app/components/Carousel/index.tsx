import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Button } from "../Button";
import { motion } from "framer-motion";
import React from "react";
import { VinylType } from "../Vinyl";

const Carousel = ({
  slides,
  id,
}: {
  slides: VinylType["images"];
  id: string;
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      className="relative w-full  max-w-3xl mx-auto"
      role="region"
      aria-roledescription="carousel"
    >
      <div className="relative h-[360px] md:h-[418px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-100 ease-in-out ${
              index === currentIndex
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
            role="group"
            aria-roledescription="slide"
          >
            <motion.img
              src={slide.uri}
              {...(index === 0 && { layoutId: `${id}-cover` })}
              className="w-full object-contain rounded-sm"
            />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <Button
        onClick={goToPrevious}
        className="absolute top-1/2 left-1 transform -translate-y-1/2 rounded-xl"
        disabled={currentIndex === 0}
        size="icon"
      >
        <CaretLeftIcon />
      </Button>

      {/* Next Button */}
      <Button
        onClick={goToNext}
        className="absolute top-1/2 right-1 transform -translate-y-1/2"
        disabled={currentIndex === slides.length - 1}
        size="icon"
      >
        <CaretRightIcon />
      </Button>
    </div>
  );
};

export default Carousel;
