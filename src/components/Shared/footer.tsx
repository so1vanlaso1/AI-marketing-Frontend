"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white text-blue-900 border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-900">About</h3>
            <p className="text-sm text-white-700 leading-relaxed">
                AI.Tech is a platform dedicated to providing cutting-edge AI solutions and resources to help businesses and individuals leverage the power of artificial intelligence.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Navigation</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/Features" className="hover:text-blue-500 transition">Features</Link></li>
              <li><Link href="/Pricing" className="hover:text-blue-500 transition">Pricing</Link></li>
              <li><Link href="/Projects" className="hover:text-blue-500 transition">Projects</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>(028) 999 9999</li>
              <li><a href="mailto:aitech@gmail.com" className="hover:text-blue-500 transition">aitech@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-blue-100 pt-5 text-center text-sm text-blue-600">
          © {year} AI.Tech. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;