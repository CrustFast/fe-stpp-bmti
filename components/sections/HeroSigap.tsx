'use client';

import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function LayananInformasi() {
  useGSAP(() => {
    gsap.from('.text-content', {
      x: -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-[#208AEB]" />

      <div className="relative z-10 mx-auto max-w-7xl h-full px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-12 lg:pt-4 text-content">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight text-white text-center lg:text-left">
                Layanan Informasi dan Pengaduan Masyarakat
              </h2>
              <p className="mt-7 text-sm sm:text-lg md:text-xl lg:text-base text-white font-medium text-center lg:text-left">
                Bersih Melayani Taat Integritas
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/img/ILUSTRASI CUSTOMER SERVICE.png"
              alt="Layanan Informasi dan Pengaduan Masyarakat"
              width={1216}
              height={621}
              priority
              quality={90}
              className="h-auto w-64 sm:w-80 md:w-96 lg:w-[460px] xl:w-[520px]"
              sizes="(max-width: 640px) 16rem, (max-width: 768px) 20rem, (max-width: 1024px) 24rem, (max-width: 1280px) 460px, 520px"
            />
          </div>

        </div>
      </div>
    </section>
  );
}