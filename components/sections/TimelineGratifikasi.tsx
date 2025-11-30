'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, FileText, Upload, Check } from 'lucide-react';

export function TimelineGratifikasi() {
  return (
    <section id="timeline" className="px-6 py-24 bg-white">
      <div className="mx-auto max-w-2xl text-left">
        <h2 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
          Langkah Mudah untuk Melaporkan Gratifikasi
        </h2>
        <p className="mt-3 mb-12 text-md leading-8 text-gray-500">
          Ikuti langkah-langkah berikut untuk melaporkan gratifikasi dengan mudah dan aman:
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
              Lengkapi form online dengan informasi detail mengenai gratifikasi yang ingin Anda laporkan. Pastikan semua data terisi dengan benar untuk mempercepat proses verifikasi.
            </p>
          </li>

          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <Download className="w-4 h-4 text-blue-600" />
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Download Formulir Laporan Gratifikasi
            </h3>
            <p className="text-base font-normal text-gray-500">
              Untuk lapor langsung ke UPG, silahkan download formulir laporan gratifikasi yang kami berikan. Dokumen ini berisi informasi yang diperlukan untuk proses lebih lanjut.
            </p>
            <a
              href="/storage/Formulir Pengaduan Gratifikasi.docx"
              download
              className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-100 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Formulir Gratifikasi
            </a>
          </li>

          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <Upload className="w-4 h-4 text-blue-600" />
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Upload Formulir Laporan Gratifikasi
            </h3>
            <p className="text-base font-normal text-gray-500">
              Unggah formulir laporan gratifikasi yang telah Anda download ke form di bawah ini. Tim kami akan segera memverifikasi laporan Anda dan mengambil langkah-langkah yang diperlukan.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}