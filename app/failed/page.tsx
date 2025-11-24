'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import type { AnimationItem } from 'lottie-web';

export const dynamic = 'force-dynamic';

const LAST_PATH_KEY = 'laporanForm:lastPath';

function FailedContent() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const errMsg = params.get('error') || 'Terjadi kesalahan saat mengirim laporan.';
  const [returnPath, setReturnPath] = React.useState('/');

  React.useEffect(() => {
    try {
      const p = localStorage.getItem(LAST_PATH_KEY);
      if (p) setReturnPath(p);
    } catch {}
  }, []);

  React.useEffect(() => {
    let anim: AnimationItem | null = null;
    let mounted = true;
    (async () => {
      try {
        const lottie = (await import('lottie-web')).default;
        if (mounted && containerRef.current) {
          anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/failed_animation.json',
          });
        }
      } catch {}
    })();
    return () => {
      mounted = false;
      anim?.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#cd472f] flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <div ref={containerRef} className="h-44 w-auto mx-auto mb-5" />
        <h2 className="text-xl sm:text-4xl font-bold tracking-wider text-white mt-7">
          Laporan Gagal Terkirim!
        </h2>
        <p className="mt-3 text-lg text-white">{errMsg}</p>
        <p className="mt-1 text-sm text-white opacity-80">
          Data yang Anda isi masih tersimpan. Silakan perbaiki dan kirim ulang.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={() => router.push(returnPath)}
            className="inline-flex items-center rounded-3xl border border-white px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-[#cd472f] transition-colors"
          >
            <svg className="mx-2 h-6 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" />
            </svg>
            Kembali ke Form
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-3xl border border-white px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-[#cd472f] transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function FailedPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-[#cd472f] text-white">Memuat...</main>}>
      <FailedContent />
    </Suspense>
  );
}