// ...existing code...
"use client";
import Navbar from "@/components/Shared/Navbar";
// tiny hook that marks element as "in view" once it intersects
import Greeting from "@/components/HomePage/Greeting";
import Footer from "@/components/Shared/footer";
import Service from "@/components/HomePage/Service";
export default function AboutPage() {
  return (
    
    <div className="min-h-screen w-full bg-white">
      <Navbar />
      <Greeting />
      <Service />
      <Footer />
    </div>
  );
}
