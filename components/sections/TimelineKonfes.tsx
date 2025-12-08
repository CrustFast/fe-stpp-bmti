'use client';

import { Download, FileText, Upload } from 'lucide-react';

export function TimelineKonfes() {
  return (
    <section id="timeline" className="px-6 py-24 bg-white">
      <div className="mx-auto max-w-2xl text-left">
        <h2 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
          Langkah Mudah untuk Melaporkan Benturan Kepentingan
        </h2>
        <p className="mt-3 mb-12 text-md leading-8 text-gray-500">
          Laporkan setiap potensi benturan kepentingan dengan proses yang sederhana, aman, dan transparan. Ikuti langkah-langkah berikut agar situasi dapat ditelaah secara objektif oleh pimpinan terkait.
        </p>

        <ol className="relative border-s border-gray-200 max-w-2xl mx-auto">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <FileText className="w-4 h-4 text-blue-600" />
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              Isi Form Online
            </h3>
            <p className="mb-4 text-base font-normal text-gray-500">
              Isi form online dengan menjelaskan situasi yang berpotensi menimbulkan benturan kepentingan. Berikan informasi sejelas mungkin agar proses penelaahan dapat dilakukan secara akurat dan adil.
            </p>
          </li>

          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <Download className="w-4 h-4 text-blue-600" />
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Download Formulir Laporan Benturan Kepentingan
            </h3>
            <p className="text-base font-normal text-gray-500">
              Jika Anda ingin melapor secara langsung, silakan unduh formulir resmi laporan benturan kepentingan. Dokumen ini membantu memastikan seluruh aspek situasi dapat dicatat secara lengkap.
            </p>
            <a
              href="/storage/Form Laporan Benturan Kepentingan.docx"
              download
              className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-100 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Formulir Benturan Kepentingan 
            </a>
          </li>

          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <Upload className="w-4 h-4 text-blue-600" />
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Upload Formulir untuk Ditelaah oleh Kepala
            </h3>
            <p className="text-base font-normal text-gray-500">
              Unggah formulir benturan kepentingan yang telah Anda isi. Laporan Anda akan diteruskan kepada Kepala unit untuk ditelaah secara profesional, sehingga potensi konflik dapat segera diantisipasi dan ditangani dengan tepat.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}