"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    tag: "A Sanctuary for Book Lovers",
    title: "Your Warm Corner of Timeless Stories",
    text: "Explore a thoughtfully curated collection of books shared by passionate readers. Borrow freely, share generously, and nourish your curiosity.",
    image: "/slides/slides-1.jpg",
  },
  {
    tag: "Share the Love of Reading",
    title: "Add a Book, Spark Someone's Imagination",
    text: "Have books sitting quietly on your shelf? Give them new life by lending them to community members who are eager to read.",
    image: "/slides/slides-2.jpg",
  },
  {
    tag: "Simple & Seamless Borrowing",
    title: "Borrow Today, Return When You're Done",
    text: "Pick any book with available copies, enjoy reading for 7 days, and return with a single click. No hidden fees, just pure reading joy.",
    image: "/slides/slides-3.jpg",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden py-6 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-base-300/70 shadow-lg">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass:
                "inline-block h-2.5 w-2.5 rounded-full bg-base-100/80 transition-all mx-1.5 cursor-pointer",
              bulletActiveClass: "!w-8 !bg-primary rounded-full",
            }}
            loop
            className="w-full"
          >
            {slides.map((s, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative flex min-h-[460px] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:min-h-[500px] lg:px-16">
                  {/* Background image */}
                  <img
                    src={s.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  {/* Light overlay, so the photo stays clear */}
                  <div className="absolute inset-0 bg-gradient-to-b from-base-100/20 via-base-100/30 to-base-100/50" />

                  {/* Text card keeps the words readable in light and dark mode */}
                  <div className="relative z-10 mx-auto max-w-3xl space-y-5 rounded-3xl bg-base-100/65 p-6 backdrop-blur-sm sm:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      <span className="text-base-content/80">{s.tag}</span>
                    </div>

                    <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl">
                      {s.title}
                    </h2>

                    <p className="mx-auto max-w-2xl text-base text-base-content/85 sm:text-lg">
                      {s.text}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                      <Link
                        href="/books"
                        className="btn btn-primary rounded-full px-8 font-semibold shadow-md transition hover:scale-105"
                      >
                        Browse Books
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Link>

                      <Link
                        href="/add-book"
                        className="btn btn-outline rounded-full border-base-300 bg-base-100/70 px-7 font-semibold hover:border-primary hover:bg-base-100"
                      >
                        Add a Book
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}