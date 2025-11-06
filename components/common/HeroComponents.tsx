'use client';

import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronsDown } from 'lucide-react';
import { useLenis } from 'lenis/react';

const HeroSection = () => {
  const lenis = useLenis();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    tl.from('.hero-logo', { scale: 0, opacity: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)' })
      .from('.hero-title', { y: 50, opacity: 0 }, '-=1.0')
      .from('.hero-subtitle', { y: 50, opacity: 0 }, '-=0.8')
      .from('.hero-button', { y: 50, opacity: 0 }, '-=0.8');

    gsap.to('.hero-button', {
      y: 10,                 
      repeat: -1,            
      yoyo: true,              
      ease: 'power1.inOut',    
      duration: 1.5,
      delay: 1.5               
    });
  });

  // const handleScrollToPengaduan = (e) => {
  //   e.preventDefault(); 
  //   lenis.scrollTo('#pengaduan', { duration: 2 }); 
  // };

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center text-center text-white">
      <img
        src="/img/bg bmti.png"
        alt="Gedung BMTI"
        className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
      />

      <div className="max-w-2xl px-4 pt-10">
        <img
          src="/img/logo-bmti.png"
          alt="Logo BMTI"
          className="h-26 w-auto mx-auto mb-10 hero-logo"
        />
        <h2 className="text-3xl font-bold sm:text-5xl tracking-wider hero-title">
          STPP
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-200 hero-subtitle">
          Sistem Terintegrasi Pengendalian dan Pengawasan
        </p>
        <a
          href="#pengaduan"
          // onClick={handleScrollToPengaduan} 
          className="mt-9 inline-flex items-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-200 shadow-sm hover:bg-white hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors duration-300 hero-button"
        >
          <ChevronsDown className="mr-2 h-4 w-4" /> 
          Mulai
        </a>
      </div>
    </section>
  );
};

export default HeroSection;