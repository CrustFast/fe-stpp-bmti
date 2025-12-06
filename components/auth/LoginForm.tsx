'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean(),
});

type LoginFormSchema = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormSchema) {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login failed:', result.error);
        toast.error('Login Gagal', {
          description: 'Email atau password salah.',
        });
        return;
      }

      toast.success('Login Berhasil!', {
        description: `Selamat datang kembali.`,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Terjadi Kesalahan', {
        description: 'Silakan coba lagi nanti.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[550px] mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-bmti mb-2">
          Selamat Datang Kembali!
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Silakan masuk untuk melanjutkan ke dashboard Anda.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    className="h-11 border-blue-500/60 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Masukkan password Anda"
                      type={showPassword ? "text" : "password"}
                      className="h-11 border-blue-500/60 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 pr-10" // Tambah pr-10 agar text tidak tertutup icon
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-bmti transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-blue-500 text-blue-bmti data-[state=checked]:bg-blue-bmti data-[state=checked]:text-white"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal text-gray-600 cursor-pointer">
                      Ingat Saya
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-11 bg-blue-bmti text-white font-medium text-base transition-all duration-300 hover:bg-white hover:text-blue-bmti hover:border hover:border-blue-bmti cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Sedang Masuk...' : 'Masuk'}
            </Button>

            <Link href="/" className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-white text-blue-bmti border border-blue-bmti font-medium text-base transition-all duration-300 hover:bg-blue-bmti hover:text-white cursor-pointer"
              >
                Kembali
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
