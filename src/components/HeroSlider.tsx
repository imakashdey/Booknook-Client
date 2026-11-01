"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  { title: "Your Small Corner of Stories", text: "Browse a growing shelf of books shared by readers like you.", bg: "from-primary to-secondary" },
  { title: "Add a Book, Share the Joy", text: "Got a book collecting dust? Add it and let others borrow it.", bg: "from-secondary to-accent" },
  { title: "Borrow Today, Return in a Week", text: "Borrow for seven days, read at your pace, return with one click.", bg: "from-accent to-primary" },
];

export default function HeroSlider() {
  return (
    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} loop>
      {slides.map((s) => (
        <SwiperSlide key={s.title}>
          <div className={`flex h-[420px] flex-col items-center justify-center gap-4 bg-gradient-to-r ${s.bg} px-6 text-center text-white`}>
            <h2 className="text-3xl font-bold md:text-5xl">{s.title}</h2>
            <p className="max-w-xl text-lg">{s.text}</p>
            <Link href="/books" className="btn btn-primary border-white">Browse Books</Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}