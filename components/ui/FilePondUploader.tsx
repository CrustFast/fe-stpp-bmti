'use client';

import { FilePond, registerPlugin } from 'react-filepond';
import type { FilePondFile } from 'filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

import { useController, type UseControllerProps } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';

type ServerConfig =
  | string
  | {
      process?: (
        fieldName: string,
        file: File,
        metadata: unknown,
        load: (id: string) => void,
        error: (msg: string) => void,
        progress: (computable: boolean, loaded: number, total: number) => void,
        abort: () => void
      ) => { abort: () => void };
      revert?: (uniqueFileId: string, load: () => void, error: (msg: string) => void) => void;
    };

type FilePondUploaderProps<T extends FieldValues> = {
  control: UseControllerProps<T>['control'];
  name: UseControllerProps<T>['name'];
  label?: string;
  helperText?: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  allowMultiple?: boolean;
  server?: ServerConfig;
};

const defaultServer: ServerConfig = {
  process: (_fieldName, file, _metadata, load, error, progress, abort) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload'); // ubah sesuai endpoint

    xhr.upload.onprogress = (e) => {
      progress(e.lengthComputable, e.loaded, e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        load(xhr.responseText || file.name);
      } else {
        error('Upload gagal');
      }
    };
    xhr.onerror = () => error('Network error');
    xhr.send(formData);

    return {
      abort: () => {
        xhr.abort();
        abort();
      },
    };
  },
  revert: (uniqueFileId, load, error) => {
    fetch(`/api/upload/${uniqueFileId}`, { method: 'DELETE' })
      .then(() => load())
      .catch(() => error('Gagal revert'));
  },
};

export function FilePondUploader<T extends FieldValues>({
  control,
  name,
  label,
  helperText,
  maxFiles = 10,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  allowMultiple = true,
  // server,
}: FilePondUploaderProps<T>) {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <FilePond
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        acceptedFileTypes={acceptedFileTypes}
        name={name}
        // server={server || defaultServer}
        onupdatefiles={(fileItems) => {
          const files = fileItems.map((item) => item.file as File);
          onChange(files);
        }}
        labelIdle='Tarik & letakkan foto / PDF di sini atau <span class="filepond--label-action">Pilih File</span>'
        credits={false}
        allowReorder={true}
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}