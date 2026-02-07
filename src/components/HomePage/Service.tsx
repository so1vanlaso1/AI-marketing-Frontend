import React from "react";
import {Link } from '@/i18n/routing';
import Image from "next/image";

const offerings = [
  {
    title: "AI Marketing",
    description:
      "Revolutionize your marketing campaigns with AI-powered targeting, content generation, and optimization.",
    points: ["Automated campaigns", "Predictive analytics", "Content generation", "A/B testing"],
    icon: "↗️",
  },
];

const Service: React.FC = () => {
  return (
    <section className="bg-slate-50 py-20 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-blue-500">What We Do</p>
          <h2 className="mt-3 text-3xl font-semibold text-blue-900 sm:text-4xl">
            AI solutions designed for growth
          </h2>
          <p className="mt-4 max-w-2xl text-slate-500">
            Unlock new efficiency and experiences with modular AI services tailored to marketing, support, and discovery.
          </p>
        </div>

        <div className="grid w-full gap-8 md:grid-cols-2 xl:grid-cols-3">
          {offerings.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col justify-between rounded-3xl border border-blue-100 bg-white p-8 shadow-[0_12px_30px_-18px_rgba(37,99,235,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(37,99,235,0.4)]"
            >
              <div className="text-left">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600 shadow-inner shadow-blue-100">
                  <Image
                    src="/AI.png"
                    alt="Service Icon"
                    width={40}
                    height={40}
                  />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-blue-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.description}</p>
                <ul className="mt-5 space-y-2 text-left text-sm text-blue-600">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/Services"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-blue-100 px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
              >
                Learn More
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;