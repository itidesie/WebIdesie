"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface LogoCarouselProps {
  logos: { src: string; alt: string }[]
}

export default function LogoCarousel({ logos }: LogoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [logos.length])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + logos.length) % logos.length)
  }

  if (logos.length === 0) {
    return <div className="text-center text-gray-500">No hay logos para mostrar.</div>
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center p-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-2 z-10 bg-white/90 hover:bg-white rounded-full shadow-lg border border-gray-200"
        aria-label="Previous logo"
      >
        <ChevronLeft className="w-6 h-6 text-[#006cff]" />
      </Button>

      <div className="relative w-full h-32 flex items-center justify-center overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 mx-16">
        <div className="flex items-center justify-center w-full h-full p-6">
          <Image
            src={logos[currentIndex].src || "/placeholder.svg"}
            alt={logos[currentIndex].alt}
            width={300}
            height={120}
            className="object-contain max-w-full max-h-full transition-all duration-500 ease-in-out filter hover:brightness-110"
            style={{
              maxWidth: "280px",
              maxHeight: "100px",
              width: "auto",
              height: "auto",
            }}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-2 z-10 bg-white/90 hover:bg-white rounded-full shadow-lg border border-gray-200"
        aria-label="Next logo"
      >
        <ChevronRight className="w-6 h-6 text-[#006cff]" />
      </Button>

      {/* Hidden pagination dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 hidden">
        {logos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-[#006cff] w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to logo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
