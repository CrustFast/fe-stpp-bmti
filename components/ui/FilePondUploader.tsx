'use client';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

interface UploaderProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;              // pastikan ada di schema form
  label?: string;
  helperText?: string;
  maxFiles?: number;
  allowMultiple?: boolean;
  acceptedFileTypes?: string[];
}

export function FilePondUploader<T extends FieldValues>({
  control,
  name,
  label,
  helperText,
  maxFiles = 10,
  allowMultiple = true,
  acceptedFileTypes,
}: UploaderProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <FilePond
        name="file" // nama field multipart yang dikirim tiap file
        instantUpload
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        acceptedFileTypes={acceptedFileTypes ?? [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf'
        ]}
        maxFileSize="10MB"
        server={{
          process: {
            url: `${API_BASE}/api/laporan/dumas/upload`,
            method: 'POST',
            withCredentials: false,
            onload: (res: string) => {
              const id = res.trim();          // filename / ID dari backend
              const arr = Array.isArray(value) ? [...value, id] : [id];
              onChange(arr);
              return id;
            },
            onerror: (err: unknown) => console.error('Upload error', err),
          },
          revert: (uniqueFileId, load) => {
            fetch(`${API_BASE}/api/laporan/dumas/upload`, {
              method: 'DELETE',
              body: uniqueFileId,
            }).finally(() => {
              const arr = (Array.isArray(value) ? value : []).filter(id => id !== uniqueFileId);
              onChange(arr);
              load();
            });
          },
        }}
        labelIdle='Tarik & letakkan foto/PDF atau <span class="filepond--label-action">Pilih File</span>'
        credits={false}
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error.message}</p>}
      {Array.isArray(value) && value.length > 0 && (
        <p className="text-xs text-green-600">Terupload: {value.length} file</p>
      )}
    </div>
  );
}