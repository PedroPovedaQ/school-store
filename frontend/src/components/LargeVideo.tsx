"use client";

import Link from "next/link";
import Image from "next/image";
import HighlightedText from "./HighlightedText";
import { getStrapiMedia } from "../utils/api-helpers";
import { renderButtonStyle } from "../utils/render-button-style";
import React, { useState, useEffect } from "react";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

interface Video {
  data: {
    id: string;
    url: string;
    attributes: {
      url: string;
      name: string;
      alternativeText: string;
    };
  };
}

interface LargeVideoProps {
  data: {
    id: string;
    title: string;
    video: Video;
  };
}

export default function LargeVideo({ data }: LargeVideoProps) {
  const [fontSize, setFontSize] = useState(4); // Initial font size in rem

  useEffect(() => {
    const handleScroll = () => {
      const newFontSize = Math.max(1, 4 - window.scrollY / 100); // Decrease font size as you scroll down
      setFontSize(newFontSize);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex relative justify-center items-center -mt-24 h-screen-plus">
      <div className="top-0 right-0 bottom-0 left-0 z-0 h-screen-plus">
        <video
          src={data.video.data.attributes.url}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover h-full w-full-vw"
        ></video>
      </div>
      <div className="flex absolute inset-0 z-0 flex-col justify-center items-center p-4 space-y-4 bg-black bg-opacity-50 h-screen-plus">
        <div id="hero-text">
          <h1
            style={{ fontSize: `${fontSize}rem` }}
            className="fade-in font-bold text-center text-mj-gold tracking-widest md:tracking-[15px] sm:tracking-[9px] font-cormorant"
          >
            Marijuana Meditations
          </h1>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          #hero-text h1 {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
