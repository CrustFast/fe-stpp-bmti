import React from 'react';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-2xl bg-white">
        {/* Left Side*/}
        <div className="hidden lg:flex lg:flex-1 bg-blue-bmti relative flex-col justify-center items-center p-12 text-white">
          <div className="relative z-10 text-center">
            <div className="mb-10 relative w-45 h-45 mx-auto">
              <Image
                src="/img/logo-bmti.png"
                alt="Logo BMTI"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold mb-5 leading-tight">
              Sistem Terintegrasi Pengaduan Pengawasan
            </h1>
            <p className="text-lg opacity-90">
              BBPPMPV BMTI - Kemendikbudristek
            </p>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-3xl"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 bg-white">
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/img/logo-bmti.png"
              alt="Logo BMTI"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-blue-bmti">STPP BMTI</h2>
          </div>

          <LoginForm />

          <div className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} BBPPMPV BMTI. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
