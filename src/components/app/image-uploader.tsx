'use client';

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
}

export function ImageUploader({ onFileChange, previewUrl }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onFileChange(file || null);
  };

  const handleRemoveImage = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative group w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex justify-center items-center">
          <Image src={previewUrl} alt="Image preview" fill className="object-contain" data-ai-hint="medical analysis" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full h-8 w-8"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="relative block w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-primary transition-colors bg-white hover:bg-primary/5"
        >
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Upload className="mx-auto h-12 w-12" />
            <span className="mt-2 block text-sm font-semibold text-foreground">
              Click to upload an image
            </span>
            <span className="text-xs">PNG, JPG, or GIF</span>
          </div>
          <input
            ref={inputRef}
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileSelect}
          />
        </label>
      )}
    </div>
  );
}
