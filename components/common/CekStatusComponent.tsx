'use client';

import React, { useEffect, useRef, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clipboard, Search } from 'lucide-react';
import gsap from 'gsap';

const schema = z.object({
  idPengaduan: z
    .string()
    .min(5, 'ID Pengaduan minimal 5 karakter')
    .regex(/^[A-Z0-9-]+$/, 'Format ID tidak valid'),
});

type FormData = z.infer<typeof schema>;

const CekStatusComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm<FormData>({
  //   resolver: zodResolver(schema),
  // });

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([titleRef.current, descRef.current], {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      });
      gsap.from(formRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out',
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (resultRef.current && result) {
      gsap.from(resultRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [result]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    // tes API aja sih ini
    setTimeout(() => {
      setResult({
        id: data.idPengaduan,
        status: 'Sedang Diproses',
        tanggal: '2025-11-05',
        keterangan: 'Aduan Anda sedang ditinjau oleh tim terkait.',
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section id="cekStatus" className="py-24 bg-white">
      <div className="mx-auto max-w-2xl text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2
          ref={titleRef}
          className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl inline-block relative"
        >
          Cek Status Pengaduan Anda
        </h2>
        <p
          ref={descRef}
          className="mt-6 text-md leading-8 text-gray-500"
        >
          Layanan ini memungkinkan Anda untuk memantau perkembangan dan penanganan aduan yang telah Anda sampaikan.
        </p>
      </div>

      <form
        ref={formRef}
        // onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-center max-w-2xl mx-auto gap-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Clipboard className="w-5 h-5 text-gray-500" />
          </div>
          <input
            // {...register('idPengaduan')}
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-3 transition-all"
            placeholder="Masukkan ID pengaduan Anda..."
            disabled={isLoading}
          />
          {/* {errors.idPengaduan && (
            <p className="mt-1 text-sm text-red-600">{errors.idPengaduan.message}</p>
          )} */}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          aria-label="Cek status"
          className="h-11 px-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {result && (
        <div
          ref={resultRef}
          className="mt-12 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Status Pengaduan</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">ID Pengaduan:</span>
              <span className="font-bold text-blue-700">{result.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Status:</span>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                {result.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Tanggal Pengaduan:</span>
              <span>{result.tanggal}</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-700">{result.keterangan}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CekStatusComponent;