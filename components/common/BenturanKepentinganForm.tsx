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
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { FilePondUploader } from '@/components/ui/FilePondUploader';
import { submitLaporanBenturan } from '@/app/laporan/dumas/action';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  // 1. Informasi Pelapor
  nama_pelapor: z.string().min(1, 'Nama pelapor wajib diisi.'),
  jabatan: z.string().min(1, 'Jabatan wajib diisi.'),
  nomor_telepon: z.string().regex(/^\d{10,15}$/, 'Nomor telepon harus 10-15 digit.'),
  email_pelapor: z.string().email('Format email tidak valid.'),

  // 2. Informasi Pihak Terlibat
  nama_pihak_terlibat: z.string().min(1, 'Nama pihak terlibat wajib diisi.'),
  jabatan_pihak_terlibat: z.string().min(1, 'Jabatan pihak terlibat wajib diisi.'),
  program_keahlian_id: z.string().min(1, 'Unit kerja wajib dipilih.'),

  // 3. Deskripsi Kejadian
  tanggal_penerimaan_penolakan: z
    .date()
    .nullable()
    .refine((d) => d instanceof Date, { message: 'Tanggal penerimaan wajib diisi.' }),
  tanggal_dilaporkan: z
    .date()
    .nullable()
    .refine((d) => d instanceof Date, { message: 'Tanggal dilaporkan wajib diisi.' }),
  tempat_kejadian: z.string().min(1, 'Tempat kejadian wajib diisi.'),
  jenis_benturan_id: z.string().min(1, 'Jenis benturan wajib dipilih.'),
  kronologi_kejadian: z.string().min(1, 'Kronologi kejadian wajib diisi.'),

  bukti_files: z
    .array(z.string())
    .min(1, 'Minimal 1 file bukti harus diunggah.')
});

export type BenturanFormSchema = z.infer<typeof formSchema>;

interface BenturanKepentinganFormProps {
  unitKerjaOptions: { id: string | number; nama_unit: string }[];
  jenisBenturanOptions: { kode_id: string | number; jenis_benturan_kepentingan: string }[];
  onSubmit?: (data: BenturanFormSchema) => Promise<void> | void;
}

export function BenturanKepentinganForm({
  unitKerjaOptions,
  jenisBenturanOptions,
  onSubmit,
}: BenturanKepentinganFormProps) {
  const form = useForm<BenturanFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_pelapor: '',
      jabatan: '',
      nomor_telepon: '',
      email_pelapor: '',
      nama_pihak_terlibat: '',
      jabatan_pihak_terlibat: '',
      program_keahlian_id: '',
      tanggal_penerimaan_penolakan: null,
      tanggal_dilaporkan: null,
      tempat_kejadian: '',
      jenis_benturan_id: '',
      kronologi_kejadian: '',
      bukti_files: [],
    },
  });

  const router = useRouter();

  const [openTanggalPenerimaan, setOpenTanggalPenerimaan] = React.useState(false);
  const [openTanggalDilaporkan, setOpenTanggalDilaporkan] = React.useState(false);

  const hasGlobalErrors =
    Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted;

  async function handleSubmit(values: BenturanFormSchema) {
    if (onSubmit) {
      await onSubmit(values);
      return;
    }

    try {
      const formData = new FormData();

      formData.append('nama_pelapor', values.nama_pelapor);
      formData.append('jabatan', values.jabatan);
      formData.append('nomor_telepon', values.nomor_telepon);
      formData.append('email_pelapor', values.email_pelapor);
      formData.append('nama_pihak_terlibat', values.nama_pihak_terlibat);
      formData.append('jabatan_pihak_terlibat', values.jabatan_pihak_terlibat);
      formData.append('program_keahlian_id', values.program_keahlian_id);
      formData.append('tempat_kejadian', values.tempat_kejadian);
      formData.append('jenis_benturan_id', values.jenis_benturan_id);
      formData.append('kronologi_kejadian', values.kronologi_kejadian);

      if (values.tanggal_penerimaan_penolakan) {
        formData.append(
          'tanggal_penerimaan_penolakan',
          format(values.tanggal_penerimaan_penolakan, 'yyyy-MM-dd')
        );
      }
      if (values.tanggal_dilaporkan) {
        formData.append(
          'tanggal_dilaporkan',
          format(values.tanggal_dilaporkan, 'yyyy-MM-dd')
        );
      }

      if (values.bukti_files && values.bukti_files.length > 0) {
        formData.append('bukti_files_ids', JSON.stringify(values.bukti_files));
      }

      await submitLaporanBenturan(formData);

      toast.success('Laporan Benturan Kepentingan Terkirim!', {
        description: 'Terima kasih atas laporan Anda.',
      });
      form.reset();
      router.push('/success');
    } catch (error: unknown) {
      console.error(error);
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
    }
  }

  return (
    <div id="benturanKepentinganForm" className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-blue-bmti sm:text-4xl">
          Lengkapi Data dan Tuliskan Pengaduan
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mx-auto mt-3 max-w-xl sm:mt-20 bg-white shadow-xl rounded-lg p-6"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <FormItem className="sm:col-span-2">
              <FormLabel className="block text-base font-bold text-center">
                Form Laporan Benturan Kepentingan
              </FormLabel>
            </FormItem>

            <SectionLabel className="sm:col-span-2" title="1. Informasi Pelapor" />

            <TextInput control={form.control} name="nama_pelapor" label="Nama Pelapor" required />
            <TextInput control={form.control} name="jabatan" label="Jabatan" required />
            <TextInput
              control={form.control}
              name="nomor_telepon"
              label="Nomor Telepon Pelapor"
              required
              type="tel"
              placeholder=""
            />
            <TextInput
              control={form.control}
              name="email_pelapor"
              label="Email Pelapor"
              required
              type="email"
            />

            <SectionLabel className="sm:col-span-2 mt-4" title="2. Informasi Pihak Terlibat" />

            <TextInput
              control={form.control}
              name="nama_pihak_terlibat"
              label="Nama Pihak Terlibat"
              required
            />
            <TextInput
              control={form.control}
              name="jabatan_pihak_terlibat"
              label="Jabatan Pihak Terlibat"
              required
            />

            <FormField
              control={form.control}
              name="program_keahlian_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Unit Kerja <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger
                        className={cn(
                          'h-11 w-full rounded-md border border-blue-500/60 bg-white px-3 text-sm',
                          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:text-blue-500'
                        )}
                      >
                        <SelectValue placeholder="Pilih Unit Kerja" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {unitKerjaOptions.map((u) => (
                          <SelectItem
                            key={u.id}
                            value={String(u.id)}
                            className="text-sm py-2"
                          >
                            {u.nama_unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SectionLabel className="sm:col-span-2 mt-4" title="3. Deskripsi Kejadian" />

            <FormField
              control={form.control}
              name="tanggal_penerimaan_penolakan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tanggal Penerimaan <span className="text-red-600">*</span>
                  </FormLabel>
                  <DatePopover
                    value={field.value}
                    onChange={field.onChange}
                    open={openTanggalPenerimaan}
                    setOpen={setOpenTanggalPenerimaan}
                    placeholder="Tanggal Penerimaan"
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
                    Tanggal Dilaporkan ke SPI <span className="text-red-600">*</span>
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

            <TextInput
              control={form.control}
              name="tempat_kejadian"
              label="Tempat Kejadian"
              required
            />

            <FormField
              control={form.control}
              name="jenis_benturan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jenis Benturan Kepentingan <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger
                        className={cn(
                          'h-11 w-full rounded-md border border-blue-500/60 bg-white px-3 text-sm',
                          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:text-blue-500'
                        )}
                      >
                        <SelectValue placeholder="Pilih Jenis" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {jenisBenturanOptions.map((j) => (
                          <SelectItem
                            key={j.kode_id}
                            value={String(j.kode_id)}
                            className="text-sm py-2"
                          >
                            {j.jenis_benturan_kepentingan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kronologi_kejadian"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 mt-2">
                  <FormLabel>
                    Kronologi Kejadian <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Kronologi Kejadian"
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
              render={({ field }) => (
                <FormItem className="sm:col-span-2 mt-2">
                  <FormLabel>
                    Upload file (dokumen, foto, video, dll.) <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <FilePondUploader
                      control={form.control}
                      name="bukti_files"
                      helperText="Minimal 1 file. Maks 10 file. Format: Gambar / Video / PDF / DOC / DOCX"
                      maxFiles={10}
                      allowMultiple
                      acceptedFileTypes={[
                        'image/*',
                        'video/*',
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
              className="w-full bg-blue-500 hover:bg-blue-500 text-white cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Mengirim...' : 'KIRIM!'}
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

type TextFieldNames =
  | 'nama_pelapor'
  | 'jabatan'
  | 'nomor_telepon'
  | 'email_pelapor'
  | 'nama_pihak_terlibat'
  | 'jabatan_pihak_terlibat'
  | 'tempat_kejadian';

function TextInput({
  control,
  name,
  label,
  required,
  type,
  placeholder,
}: {
  control: Control<BenturanFormSchema>;
  name: TextFieldNames;
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