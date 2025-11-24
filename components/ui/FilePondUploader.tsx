'use client';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

import { useController, type UseControllerProps } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { useRef } from 'react';
import type { FilePond as FilePondCore } from 'filepond';

export function FilePondUploader<T extends FieldValues>({
  control,
  name,
  label,
  helperText,
  maxFiles = 10,
  allowMultiple = true,
  acceptedFileTypes,
}: {
  control: UseControllerProps<T>['control'];
  name: UseControllerProps<T>['name'];
  label?: string;
  helperText?: string;
  maxFiles?: number;
  allowMultiple?: boolean;
  acceptedFileTypes?: string[];
}) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const pondRef = useRef<FilePondCore | null>(null);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <FilePond
        ref={(instance) => {
          pondRef.current = instance as FilePondCore | null;
        }}
        files={(value as File[] | undefined) ?? []}
        onupdatefiles={(items) => {
          const files = items.map(i => i.file as File).filter(Boolean);
          onChange(files);
        }}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        acceptedFileTypes={acceptedFileTypes ?? [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf'
        ]}
        server={{
          process: (_fieldName, file, _metadata, load, error, progress, abort) => {
            const total = file.size || 1;
            let uploaded = 0;
            const speed = Math.max(50_000, total / 40); 
            const interval = setInterval(() => {
              uploaded = Math.min(uploaded + speed, total);
              progress(true, uploaded, total); 
              if (uploaded >= total) {
                clearInterval(interval);
                load(file.name); 
              }
            }, 100);
            return {
              abort: () => {
                clearInterval(interval);
                abort();
              }
            };
          },
          revert: (_serverFileId, load) => {
            load(); 
          }
        }}
        instantUpload={true}      
        allowProcess={true}
        storeAsFile
        credits={false}
        labelIdle='Tarik & letakkan foto/PDF atau <span class="filepond--label-action">Pilih File</span>'
        labelFileProcessing='Mengupload...'
        labelFileProcessingComplete='Selesai'
        labelFileProcessingAborted='Dibatalkan'
        labelFileProcessingError='Gagal'
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}