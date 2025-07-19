"use client";

import { useCallback, useRef, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface UploaderProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
}

export function Uploader({ value, onChange }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      console.log(acceptedFiles[0]);
    }
  }, []);

  const onDropRejected = (fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const rejection = fileRejections[0];
      let message = "File could not be uploaded. Please try again.";
      if (rejection.errors.some((e) => e.code === "file-too-large")) {
        message = "File is too large. Max size is 5MB.";
      } else if (rejection.errors.some((e) => e.code === "file-invalid-type")) {
        message = "Invalid file type. Only images are allowed.";
      } else if (rejection.errors.some((e) => e.code === "too-many-files")) {
        message = "You can only upload one file at a time.";
      }
      setError(message);
      toast.error(message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <Card
      className={cn(
        "border border-dashed border-input dark:bg-input/30 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors duration-150 min-h-32 hover:bg-muted/60 cursor-pointer",
        isDragActive && "border-primary border-solid"
      )}
      {...getRootProps()}
    >
      <CardContent className="p-0 w-full flex flex-col items-center justify-center">
        <Input {...getInputProps()} ref={inputRef} />
        {error ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <AlertCircle className="size-7 text-destructive" />
            <span className=" text-sm text-destructive font-medium w-full text-center">
              {error}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setError("");
              }}
            >
              Try uploading again
            </Button>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-2 w-full">
            {value.type.startsWith("image/") && (
              <Image
                src={URL.createObjectURL(value)}
                alt={value.name}
                className="w-24 h-24 object-cover rounded-md border mb-2"
                fill
              />
            )}
            <span className="text-sm font-medium truncate max-w-full">
              {value.name}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange(null);
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <Upload className="size-7 mb-1" />
            <span className="font-medium">
              {isDragActive
                ? "Drop the file here..."
                : "Drag & drop or click to upload"}
            </span>
            <span className="text-xs text-muted-foreground">
              PNG, JPG, JPEG, GIF, SVG (max 5MB)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
