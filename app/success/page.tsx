'use client';

import Link from 'next/link';
import React from 'react';
import type { AnimationItem } from 'lottie-web';

const DRAFT_KEY = 'laporanForm:draft';
const LAST_PATH_KEY = 'laporanForm:lastPath';

export default function SuccessPage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(LAST_PATH_KEY);
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
            path: '/success_animation.json',
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
    <main className="min-h-screen bg-[#2FCD71] flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <div ref={containerRef} className="h-44 w-auto mx-auto mb-5" />
        <h2 className="text-xl sm:text-4xl font-bold tracking-wider text-white mt-7">
          Terima Kasih, Laporan Anda Telah Kami Terima.
        </h2>
        <p className="mt-1 text-lg text-white">
          Silakan cek WhatsApp Anda untuk informasi status laporan.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center rounded-3xl border border-white px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-[#2FCD71] transition-colors"
        >
          <svg className="mx-2 h-6 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" />
          </svg>
          Back
        </Link>
      </div>
    </main>
  );
}