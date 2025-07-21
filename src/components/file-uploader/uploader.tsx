"use client";

import { type FileRejection, useDropzone } from "react-dropzone";
import { Upload, AlertCircle, X, Loader2 } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";

import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface FileState {
  objectUrl: string | null;
  uploading: boolean;
  progress: number;
  errorMessage: string | null;
  isDeleting: boolean;
}

interface UploaderProps {
  value: string;
  onChange: (fileKey: string) => void;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
}

export function Uploader({ value, onChange }: UploaderProps) {
  const [fileState, setFileState] = useState<FileState>({
    objectUrl: null,
    uploading: false,
    progress: 0,
    errorMessage: null,
    isDeleting: false,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
        errorMessage: null,
      }));

      try {
        const { data } = await axios.post<PresignedUrlResponse>(
          "/api/s3/upload",
          {
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: true,
          }
        );

        const { presignedUrl, fileKey } = data;

        await axios.put(presignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setFileState((prev) => ({ ...prev, progress: percent }));
            }
          },
        });

        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          errorMessage: null,
        }));
        toast.success("File uploaded successfully!");
        onChange(fileKey);
      } catch {
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          errorMessage: "Failed to upload file. Please try again.",
          progress: 0,
        }));
        toast.error("Failed to upload file. Please try again.");
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        const file = acceptedFiles[0];

        setFileState({
          objectUrl: URL.createObjectURL(file),
          uploading: true,
          progress: 0,
          errorMessage: null,
          isDeleting: false,
        });

        await uploadFile(file);
      }
    },
    [uploadFile]
  );

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
      setFileState((prev) => ({ ...prev, errorMessage: message }));
      toast.error(message);
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    setFileState((prev) => ({ ...prev, isDeleting: true }));
    try {
      await axios.delete("/api/s3/delete", { data: { key: value } });
      setFileState((prev) => ({
        ...prev,
        objectUrl: null,
        isDeleting: false,
      }));
      onChange("");
      toast.success("File deleted successfully!");
    } catch {
      setFileState((prev) => ({ ...prev, isDeleting: false }));
      toast.error("Failed to delete file. Please try again.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled:
      fileState.uploading || fileState.isDeleting || !!fileState.objectUrl,
  });

  useEffect(() => {
    if (fileState.objectUrl && fileState.objectUrl.startsWith("blob:")) {
      const urlToRevoke = fileState.objectUrl;
      return () => {
        URL.revokeObjectURL(urlToRevoke);
      };
    }
  }, [fileState.objectUrl]);

  return (
    <Card
      className={cn(
        "border border-dashed border-input dark:bg-input/30 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors duration-150 min-h-32 cursor-pointer",
        isDragActive && "border-primary border-solid"
      )}
      {...getRootProps()}
    >
      <CardContent className="p-0 w-full flex flex-col items-center justify-center">
        <Input {...getInputProps()} />
        {fileState.errorMessage ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <AlertCircle className="size-7 text-destructive" />
            <span className=" text-sm text-destructive font-medium w-full text-center">
              {fileState.errorMessage}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setFileState((prev) => ({
                  ...prev,
                  objectUrl: null,
                  uploading: false,
                  progress: 0,
                  errorMessage: null,
                }));
              }}
            >
              Try uploading again
            </Button>
          </div>
        ) : fileState.objectUrl ? (
          <div className="relative flex flex-col items-center gap-2 w-full h-56">
            {fileState.uploading ? (
              <>
                <div className="size-32 bg-muted rounded-md border mb-2 flex items-center justify-center">
                  <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
                </div>
                <span className="text-sm font-medium">Uploading...</span>
                <Progress
                  value={fileState.progress}
                  className="w-1/3 rounded-md"
                />
              </>
            ) : (
              <>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={fileState.objectUrl}
                    alt="Uploaded image"
                    fill
                    className="object-contain h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    aria-label="Remove image"
                    className="absolute top-2 right-2 z-10 shadow-md"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleRemove();
                    }}
                    disabled={fileState.uploading || fileState.isDeleting}
                  >
                    {fileState.isDeleting ? (
                      <Loader2 className="animate-spin size-5" />
                    ) : (
                      <X className="size-5" />
                    )}
                  </Button>
                </div>
                <span className="text-sm font-medium truncate max-w-full">
                  {(value ?? "").split("-").slice(5).join("-")}
                </span>
              </>
            )}
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
