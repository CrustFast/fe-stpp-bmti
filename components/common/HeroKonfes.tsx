'use client';

import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HeroAksi() {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      y: 80,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
    })
      .from('.hero-desc', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.9');
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
      <Image
        src="/img/bg-1.jpg"
        alt="Laporan Gratifikasi"
        fill
        priority
        quality={90}
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="relative z-10 max-w-4xl px-6">
        <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-wider drop-shadow-2xl">
          Sistem Cegah Konflik dan Benturan Kepentingan
        </h1>
        <p className="hero-desc mt-6 text-lg sm:text-xl leading-8 text-gray-100 max-w-3xl mx-auto drop-shadow-md">
        Laporkan Benturan Kepentingan langsung kepada kami atau kepada instansi pemerintah berwenang dengan mudah dan aman.
        </p>
      </div>

      <div className="absolute bottom-15 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}