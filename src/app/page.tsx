"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { FaPlay, FaPause } from "react-icons/fa";
import { useState, useEffect } from "react";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";

export default function Home() {
  interface ImageData {
    id: string;
    description: string;
    urls: {
      regular: string;
    };
  }

  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://api.unsplash.com/photos?client_id=oEzTHGHb9ezfpTb4tdF2o5UFpXlFGy2wg-Rs1DyjAbo"
        );
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, images.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col items-center justify-around min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Carousel className="w-full max-w-lg flex items-center">
      <Button className=" rounded-md" onClick={handlePrevious}><GrLinkPrevious /></Button>
        <CarouselContent>
          {images.length > 0 && (
            <CarouselItem key={images[currentIndex].id}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src={images[currentIndex].urls.regular}
                      alt={images[currentIndex].description || "Image"}
                      width={500}
                      height={500}
                      className=" object-cover w-full h-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <Button className=" rounded-md" onClick={handleNext}><GrLinkNext /></Button>
      </Carousel>
      <div className="image-description mt-4">
        {images[currentIndex]?.description || "No description available"}
      </div>
      <div className="mt-4">
        {isPlaying ? (
          <Button onClick={() => setIsPlaying(false)}>
            <FaPause />
          </Button>
        ) : (
          <Button onClick={() => setIsPlaying(true)}>
            <FaPlay />
          </Button>
        )}
      </div>
    </div>
  );
}

