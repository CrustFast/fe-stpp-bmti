'use client';

import { FilePond, registerPlugin } from 'react-filepond';
import type { FilePondProps } from 'react-filepond';
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

type ServerConfig = FilePondProps['server'];

const defaultServer: ServerConfig = {
  process: (fieldName, file, _metadata, load, error, progress, abort) => {
    const formData = new FormData();
    formData.append(fieldName, file as Blob);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    xhr.upload.onprogress = (e) => {
      progress(e.lengthComputable, e.loaded, e.total);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              load(json.id || json.name || Date.now().toString());
            } catch {
              load(Date.now().toString());
            }
        } else {
          error('Upload gagal');
        }
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
  server,
}: {
  control: UseControllerProps<T>['control'];
  name: UseControllerProps<T>['name'];
  label?: string;
  helperText?: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  allowMultiple?: boolean;
  server?: ServerConfig;
}) {
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
        server={server || defaultServer}
        instantUpload
        onupdatefiles={(items) => {
          onChange(items.map(i => i.file as File));
        }}
        labelIdle='Tarik & letakkan foto / PDF di sini atau <span class="filepond--label-action">Pilih File</span>'
        credits={false}
        allowReorder
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}