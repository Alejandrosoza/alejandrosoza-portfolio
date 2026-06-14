"use client";

import dynamic from "next/dynamic";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  { ssr: false }
);

interface CloudinaryUploadWidgetProps {
  uploadPreset: string;
  options?: { folder?: string; multiple?: boolean };
  onSuccess: (results: CloudinaryUploadWidgetResults) => void;
  children: (props: { open: () => void }) => React.ReactNode;
}

export default function CloudinaryUploadWidget({
  uploadPreset,
  options,
  onSuccess,
  children,
}: CloudinaryUploadWidgetProps) {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return (
      <p className="font-body text-type-ui text-film-cream/40">
        Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment.
      </p>
    );
  }

  return (
    <CldUploadWidget uploadPreset={uploadPreset} options={options} onSuccess={onSuccess}>
      {children}
    </CldUploadWidget>
  );
}
