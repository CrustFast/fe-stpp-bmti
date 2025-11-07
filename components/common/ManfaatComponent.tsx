'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ManfaatItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const manfaatData: ManfaatItem[] = [
  {
    icon: (
      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
        <path d="m10.076 8.64-2.201-2.2V4.874a.75.75 0 0 0-.364-.643l-3.75-2.25a.75.75 0 0 0-.916.113l-.75.75a.75.75 0 0 0-.113.916l2.25 3.75a.75.75 0 0 0 .643.364h1.564l2.062 2.062 1.575-1.297Z" />
        <path fillRule="evenodd" d="m12.556 17.329 4.183 4.182a3.375 3.375 0 0 0 4.773-4.773l-3.306-3.305a6.803 6.803 0 0 1-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 0 0-.167.063l-3.086 3.748Zm3.414-1.36a.75.75 0 0 1 1.06 0l1.875 1.876a.75.75 0 1 1-1.06 1.06L15.97 17.03a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Perbaikan Sistem dan Prosedur',
    description: 'Dengan melaporkan masalah, manajemen dapat mengidentifikasi dan memperbaiki kekurangan dalam sistem atau prosedur, sehingga meningkatkan kualitas layanan.',
    delay: 200,
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Efisiensi dan Efektivitas',
    description: 'Pengaduan membantu mengoptimalkan proses kerja dan meningkatkan kinerja organisasi.',
    delay: 300,
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
        <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
      </svg>
    ),
    title: 'Hubungan yang Lebih Kuat dengan Stakeholder',
    description: 'Menanggapi pengaduan dengan cepat dan efektif dapat memperkuat kepercayaan dan hubungan antara BBPPMPV BMTI dan para pemangku kepentingannya.',
    delay: 400,
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5Z" />
        <path d="M12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6Z" />
        <path d="M12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18Z" />
        <path d="M3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5Z" />
        <path d="M5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5Z" />
        <path d="M3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12Z" />
        <path d="M9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
        <path d="M12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
        <path d="M9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
      </svg>
    ),
    title: 'Tata Kelola yang Baik',
    description: 'Pengaduan membantu memastikan bahwa BBPPMPV BMTI beroperasi dengan prinsip-prinsip transparansi, akuntabilitas, dan tanggung jawab.',
    delay: 500,
  },
];

const ManfaatComponent = () => {
  useEffect(() => {
    gsap.fromTo(
      '.manfaat-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#manfaat',
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section id="manfaat" className="py-24 bg-white">
      <div className="mx-auto max-w-2xl text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl inline-block relative"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          Manfaat Pengaduan Masyarakat
        </h2>
        <p
          className="mt-6 text-md leading-8 text-gray-500"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          Manfaat-manfaat ini menunjukkan betapa pentingnya sistem pengaduan masyarakat bagi kami dalam upaya untuk terus meningkatkan layanan dan menjawab kebutuhan masyarakat dengan lebih baik.
        </p>
      </div>

      <div className="grid max-w-5xl gap-10 mx-auto lg:grid-cols-2 px-4 sm:px-6 lg:px-8">
        {manfaatData.map((item, index) => (
          <div
            key={index}
            className="manfaat-card flex flex-col sm:flex-row bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            data-aos="fade-up"
            data-aos-delay={item.delay}
          >
            <div className="mr-4 mb-4 sm:mb-0">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 shadow-md">
                {item.icon}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManfaatComponent;