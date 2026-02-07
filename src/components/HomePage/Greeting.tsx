"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import Image from "next/image";

function useInView<T extends HTMLElement>(threshold = 0.2): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default function AboutPage() {
  const t = useTranslations('greeting');
  const [titleRef, titleInView] = useInView<HTMLHeadingElement>(0.15);
  const [paraRef, paraInView] = useInView<HTMLParagraphElement>(0.15);
  const [ctaRef, ctaInView] = useInView<HTMLDivElement>(0.15);

  return (
    <div className="w-full bg-white">
      <main className="relative">
        <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left column - copy and CTA */}
            <div className="space-y-6">
              <h1
                ref={titleRef}
                className={
                  "text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-2xl transform transition-all duration-700 ease-out " +
                  (titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
                }
              >
                {t('title')}
              </h1>

              <p
                ref={paraRef}
                className={
                  "text-lg text-white/90 max-w-xl transform transition-all duration-700 ease-out delay-150 " +
                  (paraInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
                }
              >
                {t('description')}
              </p>

              <div
                ref={ctaRef}
                className={
                  "flex items-center gap-4 transform transition-all duration-700 ease-out delay-300 " +
                  (ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
                }
              >
                <Link
                  href="/read-more"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-95"
                >
                  {t('readMore')}
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/10"
                >
                  {t('contactUs')}
                </Link>
              </div>
            </div>

            {/* Right column - visual */}
            <div className="w-full h-64 md:h-96 lg:h-128 rounded-lg overflow-hidden">
              <img
                src="/download.png"
                alt="AI Illustration"
                className="w-full h-full object-contain animate-[heroFloat_6s_ease-in-out_infinite]"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}