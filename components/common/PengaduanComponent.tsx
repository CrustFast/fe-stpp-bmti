'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Pengaduan: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardInternalRef = useRef<HTMLDivElement>(null);
  const cardExternalRef = useRef<HTMLDivElement>(null);

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    gsap.to(e.currentTarget, {
      scale: isEntering ? 1.05 : 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    gsap.to(e.currentTarget, {
      color: isEntering ? '#1d4ed8' : '#2563eb',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRadioClick = (path: string) => {
    closeModal();
    router.push(path);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      gsap.fromTo(
        '#select-modal .modal-content',
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        '#select-modal .backdrop',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isModalOpen]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        });
      }

      if (descriptionRef.current) {
        gsap.from(descriptionRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      }

      const cards = [cardInternalRef.current, cardExternalRef.current].filter(Boolean) as HTMLDivElement[];
      if (cards.length) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx>{`
        .card {
          transition: transform 0.3s;
        }
      `}</style>

      <section ref={sectionRef} id="pengaduan" className="bg-white pt-36 pb-16">
        <div className="flex justify-center">
          <div className="max-w-7xl px-6 lg:px-6">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2
                ref={headingRef}
                className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl inline-block relative"
              >
                Selamat Datang di Form Pengaduan BMTI!
              </h2>
              <p
                ref={descriptionRef}
                className="mt-6 text-md leading-8 text-gray-500"
              >
                Untuk memastikan setiap aduan ditangani dengan tepat, kami menyediakan dua kategori layanan pengaduan:
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-52 gap-y-16 sm:gap-y-20 lg:max-w-none lg:grid-cols-2">
              {/* CARD INTERNAL */}
              <div
                ref={cardInternalRef}
                className="card max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow"
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
              >
                <Image
                  className="h-8 w-auto sm:h-10"
                  src="/img/logo-bmti.png"
                  alt="Logo BMTI"
                  width={40}
                  height={40}
                />
                <h5 className="mb-2 mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  Layanan Pengaduan Internal
                </h5>
                <p className="mb-3 font-normal text-gray-500">
                  Butuh Bantuan untuk Melaporkan Gratifikasi dan benturan kepentingan? Kami Siap Membantu!
                </p>
                <a
                  href="#"
                  className="inline-flex font-medium items-center text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal();
                  }}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                >
                  Open
                  <svg className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778" />
                  </svg>
                </a>
              </div>

              {isModalOpen && (
                <div
                  id="select-modal"
                  className="fixed inset-0 z-50 flex justify-center items-center w-full h-full"
                  aria-hidden={!isModalOpen}
                >
                  <div
                    className="backdrop fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity"
                    onClick={closeModal}
                  />

                  <div
                    ref={modalRef}
                    className="modal-content relative p-4 w-full max-w-md max-h-full z-10"
                  >
                    <div className="relative bg-white rounded-lg shadow-lg">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Layanan Pengaduan Internal</h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 inline-flex justify-center items-center"
                          onClick={closeModal}
                        >
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      <div className="p-4 md:p-5">
                        <p className="text-gray-500 mb-4">Pilih layanan pengaduan yang paling sesuai untuk aduan Anda:</p>
                        <ul className="space-y-4 mb-4">
                          <li>
                            <input type="radio" id="silagra" name="job" value="silagra" className="hidden peer" required />
                            <label
                              htmlFor="silagra"
                              className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                              onClick={() => handleRadioClick('/internal')}
                            >
                              <div className="block">
                                <div className="w-full text-lg font-semibold">AKSI</div>
                                <div className="w-full text-gray-500">Aplikasi Kendali Laporan Gratifikasi</div>
                              </div>
                              <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                              </svg>
                            </label>
                          </li>
                          <li>
                            <input type="radio" id="job-2" name="job" value="job-2" className="hidden peer" />
                            <label
                              htmlFor="job-2"
                              className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                              onClick={() => handleRadioClick('/benturan-kepentingan')}
                            >
                              <div className="block">
                                <div className="w-full text-lg font-semibold">KONFES</div>
                                <div className="w-full text-gray-500">Kontrol Benturan Kepentingan Sistematis</div>
                              </div>
                              <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                              </svg>
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD EKSTERNAL */}
              <div
                ref={cardExternalRef}
                className="card max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow"
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
              >
                <Image
                  className="h-8 w-auto sm:h-10"
                  src="/img/logo-bmti.png"
                  alt="Logo BMTI"
                  width={40}
                  height={40}
                />
                <h5 className="mb-2 mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  Layanan Pengaduan Eksternal
                </h5>
                <p className="mb-3 font-normal text-gray-500">
                  Butuh Bantuan atau Ingin Memberikan Masukan? Kami Siap Mendengarkan!
                </p>
                <Link
                  href="/eksternal"
                  className="inline-flex font-medium items-center text-blue-600 hover:underline"
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                >
                  Open
                  <svg className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pengaduan;