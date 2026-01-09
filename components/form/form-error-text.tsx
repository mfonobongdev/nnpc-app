"use client";

import { useField } from "formik";

export default function FormErrorText({ name }: { name: string }) {
  const [_, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  return (
    hasError && (
      <div className="text-red-600/80 text-xs -mt-0.5">{meta.error}</div>
    )
  );
}
