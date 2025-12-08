'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { ExternalLink } from 'lucide-react';

export function LaporanOptions() {
  const lenis = useLenis();

  const handleInternalScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    lenis?.scrollTo(target, {
      offset: -100,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <section id="kanalAduan" className="overflow-hidden bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl inline-block">
          Laporkan Potensi Benturan Kepentingan Secara Transparan dan Aman!
        </h2>
        <p className="mt-6 text-md leading-8 text-gray-500">
          Apakah Anda mengalami, mengetahui, atau melihat situasi yang dapat memengaruhi objektivitas seseorang dalam pengambilan keputusan?
        </p>
        <p className="text-md leading-8 text-gray-500">
          Kami menyediakan sarana untuk membantu Anda melaporkan potensi benturan kepentingan secara mudah dan terlindungi. Laporan Anda akan membantu menjaga integritas, mencegah penyalahgunaan wewenang, dan memastikan proses berjalan secara adil.
        </p>
      </div>

      <div className="flex justify-center mt-7 mb-16 pt-9">
        <div className="max-w-7xl px-6 lg:px-6">
          <div className="grid max-w-2xl grid-cols-1 gap-x-52 gap-y-16 sm:gap-y-20 lg:max-w-none lg:grid-cols-2">
            {/* CARD 1: KONFES */}
            <div className="card max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Image
                  src="/img/logo-bmti.png"
                  alt="Logo BMTI"
                  width={40}
                  height={40}
                  className="h-8 w-auto sm:h-10"
                />
                <h3 className="ml-3 text-2xl font-semibold tracking-tight text-gray-900">
                  KONFES
                </h3>
              </div>
              <p className="mb-4 text-gray-500">
                Dengan menggunakan KONFES, Anda dapat melaporkan potensi benturan kepentingan secara cepat dan aman. Sistem kami memastikan identitas Anda tetap terlindungi, dan setiap laporan akan ditelaah secara profesional untuk menjaga transparansi dan keadilan.
              </p>
              <Link
                href="#timeline"
                onClick={(e) => handleInternalScroll(e, '#timeline')}
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Open
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* CARD 2: WBS Kemdikdasmen */}
            <div className="card max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Image
                  src="/img/kemdikbud_logo.png"
                  alt="Logo WBS Kemendikdasmen"
                  width={40}
                  height={40}
                  className="h-8 w-auto sm:h-10"
                />
                <h3 className="ml-3 text-2xl font-semibold tracking-tight text-gray-900">
                  WBS Kemendikdasmen
                </h3>
              </div>
              <p className="mb-4 text-gray-500">
                Anda juga dapat menyampaikan laporan melalui Whistleblowing System (WBS) Kemdikdasmen. Kanal ini disediakan untuk memastikan setiap dugaan benturan kepentingan dapat ditangani secara objektif dan profesional.
              </p>
              <a
                href="https://www.kemendikbudristek.com/wbs-sub/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Open
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}