'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';

const PanduanComponent = () => {
  const handleStepHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const target = e.currentTarget.querySelector('.step-content') as HTMLDivElement | null;
    if (!target) return;

    gsap.to(target, {
      y: enter ? -5 : 0,
      scale: enter ? 1.02 : 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  useEffect(() => {
    gsap.from('.step-content', {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  return (
    <section id="panduan" className="bg-white py-16 lg:py-20">
      <div className="px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-7xl md:px-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl inline-block relative">
            Panduan Penggunaan
          </h2>
          <p className="mt-6 text-md leading-8 text-gray-500">
            Untuk membantu Anda dalam proses ini, kami telah menyusun panduan penggunaan yang akan memandu Anda melalui setiap langkah pengajuan aduan:
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div
            className="step-item relative text-center"
            onMouseEnter={(e) => handleStepHover(e, true)}
            onMouseLeave={(e) => handleStepHover(e, false)}
          >
            <div className="step-content">
              <div className="flex items-center justify-center w-16 h-16 shadow-md mx-auto mb-4 rounded-full bg-indigo-50 sm:w-20 sm:h-20">
                <svg
                  className="w-12 h-12 text-blue-600 sm:w-16 sm:h-16" 
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 4v3a1 1 0 0 1-1 1h-3m2 10v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L6.7 8.35A1 1 0 0 1 7.46 8H9m-1 4H4m16-7v10a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7.87a1 1 0 0 1 .24-.65l2.46-2.87a1 1 0 0 1 .76-.35H19a1 1 0 0 1 1 1Z"
                  />
                </svg>
              </div>
              <h6 className="mb-2 text-2xl font-extrabold">Step 1</h6>
              <p className="text-gray-900 font-semibold mb-1">
                Pilih Klasifikasi Laporan
              </p>
              <p className="max-w-md mb-3 text-sm text-gray-500 sm:mx-auto">
                Mulai dengan memilih kategori yang paling sesuai untuk aduan Anda. Pilihan ini akan memastikan bahwa aduan Anda diteruskan ke departemen yang tepat untuk penanganan yang cepat dan tepat.
              </p>
            </div>
            <div className="top-0 right-0 flex items-center justify-center h-24 lg:-mr-8 lg:absolute">
              <svg
                className="w-8 text-gray-700 transform rotate-90 lg:rotate-0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line fill="none" strokeMiterlimit="10" x1="2" y1="12" x2="22" y2="12"></line>
                <polyline fill="none" strokeMiterlimit="10" points="15,5 22,12 15,19 "></polyline>
              </svg>
            </div>
          </div>
          <div
            className="step-item relative text-center"
            onMouseEnter={(e) => handleStepHover(e, true)}
            onMouseLeave={(e) => handleStepHover(e, false)}
          >
            <div className="step-content">
              <div className="flex items-center justify-center w-16 h-16 shadow-md mx-auto mb-4 rounded-full bg-indigo-50 sm:w-20 sm:h-20">
                <svg
                  className="w-12 h-12 text-blue-600 sm:w-16 sm:h-16"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
                  />
                </svg>
              </div>
              <h6 className="mb-2 text-2xl font-extrabold">Step 2</h6>
              <p className="text-gray-900 font-semibold mb-1">
                Isi Formulir Pengaduan
              </p>
              <p className="max-w-md mb-3 text-sm text-gray-500 sm:mx-auto">
                Lengkapi formulir dengan informasi yang dibutuhkan. Pastikan Anda memberikan deskripsi yang jelas dan lengkap dari masalah yang Anda hadapi.
              </p>
            </div>
            <div className="top-0 right-0 flex items-center justify-center h-24 lg:-mr-8 lg:absolute">
              <svg
                className="w-8 text-gray-700 transform rotate-90 lg:rotate-0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line fill="none" strokeMiterlimit="10" x1="2" y1="12" x2="22" y2="12"></line>
                <polyline fill="none" strokeMiterlimit="10" points="15,5 22,12 15,19 "></polyline>
              </svg>
            </div>
          </div>
          <div
            className="step-item relative text-center"
            onMouseEnter={(e) => handleStepHover(e, true)}
            onMouseLeave={(e) => handleStepHover(e, false)}
          >
            <div className="step-content">
              <div className="flex items-center justify-center w-16 h-16 shadow-md mx-auto mb-4 rounded-full bg-indigo-50 sm:w-20 sm:h-20">
                <svg
                  className="w-12 h-12 text-blue-600 sm:w-16 sm:h-16"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                  />
                </svg>
              </div>
              <h6 className="mb-2 text-2xl font-extrabold">Step 3</h6>
              <p className="text-gray-900 font-semibold mb-1">
                Status Aduan
              </p>
              <p className="max-w-md mb-3 text-sm text-gray-500 sm:mx-auto">
                Mulai dengan memilih kategori yang paling sesuai untuk aduan Anda. Pilihan ini akan memastikan bahwa aduan Anda diteruskan ke departemen yang tepat untuk penanganan yang cepat dan tepat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanduanComponent;