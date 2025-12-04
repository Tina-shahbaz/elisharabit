"use client";
import Image from "next/image";

export default function WhatIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-gray-50">
      {/* Left Image */}
      <div className="relative w-full h-64 md:h-auto md:block">
        <Image
          src="/Assembly.webp" // apni image ka path
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Right Side Content */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-8 md:py-0">
        <h1 className="text-3xl font-bold mb-4">What is GoZipply?</h1>
        <p className="text-gray-700 text-lg">
          GoZipply is an online and mobile marketplace that matches freelance labor with local demand, allowing consumers to find immediate help with everyday tasks, including cleaning, moving, delivery, and handyman work. It helps people earn money by completing tasks for others in their local community.
        </p>
      </div>
    </div>
  );
}
