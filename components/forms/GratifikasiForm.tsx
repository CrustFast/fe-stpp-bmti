'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import type { Control, FieldError } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { FilePondUploader } from '@/components/ui/FilePondUploader';
import { submitLaporanGratifikasi } from '@/app/laporan/dumas/action';
import { useRouter } from 'next/navigation';

const jenisLaporanOptions = ['penerimaan', 'penolakan'] as const;

const formSchema = z.object({
  jenis_laporan: z
    .enum(jenisLaporanOptions)
    .nullable()
    .refine((val) => val != null, { message: 'Pilih jenis laporan.' }),

  nama_pelapor: z.string().min(1, 'Nama pelapor wajib diisi.'),
  jabatan: z.string().min(1, 'Jabatan wajib diisi.'),
  nomor_telepon: z
    .string()
    .regex(/^\d{10,15}$/, 'Nomor telepon harus 10-15 digit.'),
  email: z.string().email('Format email tidak valid.'),

  tanggal_penerimaan_penolakan: z
    .date()
    .nullable()
    .refine((d) => d instanceof Date, { message: 'Tanggal wajib diisi.' }),

  tanggal_dilaporkan: z
    .date()
    .nullable()
    .refine((d) => d instanceof Date, { message: 'Tanggal dilaporkan wajib diisi.' }),

  nama_pemberi: z.string().min(1, 'Nama pemberi wajib diisi.'),
  hubungan: z.string().min(1, 'Hubungan wajib diisi.'),
  objek_gratifikasi: z.string().min(1, 'Objek gratifikasi wajib diisi.'),
  kronologi: z.string().min(1, 'Kronologi wajib diisi.'),
  bukti_files: z
    .array(z.string())
    .min(1, 'Minimal 1 file bukti harus diunggah.')
});

type FormSchema = z.infer<typeof formSchema>;

export function GratifikasiForm() {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenis_laporan: undefined,
      nama_pelapor: '',
      jabatan: '',
      nomor_telepon: '',
      email: '',
      nama_pemberi: '',
      hubungan: '',
      objek_gratifikasi: '',
      kronologi: '',
      bukti_files: [],
      tanggal_penerimaan_penolakan: undefined,
      tanggal_dilaporkan: undefined,
    },
  });

  const jenisLaporan = form.watch('jenis_laporan');
  const labelTanggalUtama =
    jenisLaporan === 'penolakan' ? 'Tanggal Penolakan' : 'Tanggal Penerimaan';

  const [openTanggalUtama, setOpenTanggalUtama] = React.useState(false);
  const [openTanggalDilaporkan, setOpenTanggalDilaporkan] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(values: FormSchema) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append('jenis_laporan', values.jenis_laporan || '');
      formData.append('nama_pelapor', values.nama_pelapor);
      formData.append('jabatan', values.jabatan);
      formData.append('nomor_telepon', values.nomor_telepon);
      formData.append('email', values.email);
      formData.append('nama_pemberi', values.nama_pemberi);
      formData.append('hubungan', values.hubungan);
      formData.append('objek_gratifikasi', values.objek_gratifikasi);
      formData.append('kronologi', values.kronologi);

      if (values.tanggal_penerimaan_penolakan) {
        formData.append('tanggal_penerimaan_penolakan', format(values.tanggal_penerimaan_penolakan, 'yyyy-MM-dd'));
      }
      if (values.tanggal_dilaporkan) {
        formData.append('tanggal_dilaporkan', format(values.tanggal_dilaporkan, 'yyyy-MM-dd'));
      }

      if (values.bukti_files && values.bukti_files.length > 0) {
        formData.append('bukti_files_ids', JSON.stringify(values.bukti_files));
      }

      const result = await submitLaporanGratifikasi(formData);

      toast.success('Laporan Gratifikasi Terkirim!', {
        description: `Terima kasih. Kode Laporan: ${result.data?.kode_gratifikasi || '-'}`,
      });

      form.reset();
      router.push('/success');
    } catch (error: unknown) {
      console.error('Submission Error:', error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Terjadi kesalahan saat mengirim data.';
      toast.error('Gagal mengirim laporan', {
        description: message,
      });
      router.push(`/failed?${new URLSearchParams({ error: message })}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasGlobalErrors = Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted;

  return (
    <div id="gratifikasiForm" className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
          Lengkapi Data dan Tuliskan Pengaduan
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-3 max-w-xl sm:mt-20 bg-white shadow-xl rounded-lg p-6"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <FormItem className="sm:col-span-2">
              <FormLabel className="block text-base font-bold text-center">
                Form Input Laporan Gratifikasi
              </FormLabel>
            </FormItem>

            <FormField
              control={form.control}
              name="jenis_laporan"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 mt-2">
                  <FormLabel className="block text-sm font-semibold text-center w-full">
                    Jenis Laporan <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                      className="flex justify-center mt-3"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-x-2">
                          <RadioGroupItem
                            value="penerimaan"
                            id="penerimaan"
                            className="border-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <FormLabel htmlFor="penerimaan" className="font-normal cursor-pointer">
                            Penerimaan
                          </FormLabel>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <RadioGroupItem
                            value="penolakan"
                            id="penolakan"
                            className="border-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <FormLabel htmlFor="penolakan" className="font-normal cursor-pointer">
                            Penolakan
                          </FormLabel>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SectionLabel className="sm:col-span-2" title="1. Informasi Pelapor" />

            <InputField
              control={form.control}
              name="nama_pelapor"
              label="Nama Pelapor"
              required
            />
            <InputField control={form.control} name="jabatan" label="Jabatan" required />
            <InputField
              control={form.control}
              name="nomor_telepon"
              label="Nomor WhatsApp Aktif Pelapor"
              required
              type="tel"
              placeholder="Contoh: 081234567890"
            />
            <InputField control={form.control} name="email" label="Email Pelapor (Gmail)" required type="email" placeholder="email@gmail.com" />

            <SectionLabel className="sm:col-span-2 mt-4" title="2. Deskripsi Kejadian" />

            <FormField
              control={form.control}
              name="tanggal_penerimaan_penolakan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {labelTanggalUtama} <span className="text-red-600">*</span>
                  </FormLabel>
                  <DatePopover
                    value={field.value}
                    onChange={field.onChange}
                    open={openTanggalUtama}
                    setOpen={setOpenTanggalUtama}
                    placeholder={labelTanggalUtama}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggal_dilaporkan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tanggal Dilaporkan ke UPG <span className="text-red-600">*</span>
                  </FormLabel>
                  <DatePopover
                    value={field.value}
                    onChange={field.onChange}
                    open={openTanggalDilaporkan}
                    setOpen={setOpenTanggalDilaporkan}
                    placeholder="Tanggal Dilaporkan"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <InputField control={form.control} name="nama_pemberi" label="Nama Pemberi Gratifikasi" required />
            <InputField control={form.control} name="hubungan" label="Hubungan" required />
            <InputField control={form.control} name="objek_gratifikasi" label="Objek Gratifikasi" required />

            <FormField
              control={form.control}
              name="kronologi"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 mt-2">
                  <FormLabel>
                    Kronologi Kejadian <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Ceritakan kronologi kejadian secara detail..."
                      className="border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bukti_files"
              render={() => (
                <FormItem className="sm:col-span-2 mt-2">
                  <FormLabel>
                    Foto(Bukti) / Dokumen <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <FilePondUploader
                      control={form.control}
                      name="bukti_files"
                      helperText="Minimal 1 file. Maks 3 file. Format: Gambar / PDF"
                      maxFiles={10}
                      allowMultiple
                      acceptedFileTypes={[
                        'image/*',
                        'application/pdf',
                        // 'application/msword',
                        // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {hasGlobalErrors && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
              <p className="font-semibold mb-2">
                Anda belum mengisi semua data yang diperlukan. Silakan lengkapi dan coba lagi.
              </p>
              <ul className="list-disc ps-5 space-y-1">
                {(Object.values(form.formState.errors) as FieldError[]).map((err, i) => (
                  <li key={i}>{err?.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'KIRIM!'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function SectionLabel({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn('sm:col-span-2', className)}>
      <FormLabel className="block text-base font-bold leading-6 text-gray-900">
        {title} <span className="text-red-600">*</span>
      </FormLabel>
    </div>
  );
}

function DatePopover({
  value,
  onChange,
  open,
  setOpen,
  placeholder,
}: {
  value: Date | null;
  onChange: (d: Date | null) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  placeholder: string;
}) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn(
            'h-11 w-full pl-3 pr-3 py-0 items-center text-left font-normal',
            'border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500',
            value ? 'text-black' : 'text-muted-foreground'
          )}
        >
          {value instanceof Date ? format(value, 'dd MMMM yyyy', { locale: id }) : placeholder}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={id}
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => {
            if (d) {
              onChange(d);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function InputField({
  control,
  name,
  label,
  required,
  type,
  placeholder,
}: {
  control: Control<FormSchema>;
  name: Extract<keyof FormSchema, 'nama_pelapor' | 'jabatan' | 'nomor_telepon' | 'email' | 'nama_pemberi' | 'hubungan' | 'objek_gratifikasi'>;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-600">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder ?? ' '}
              className="h-11 border-blue-500/60 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus:text-blue-500"
              {...field}
              value={field.value as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
