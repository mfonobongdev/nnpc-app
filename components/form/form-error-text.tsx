import { useField } from "formik";

export default function FormErrorText({ name }: { name: string }) {
  const [_, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  return (
    hasError && <div className="text-red-500 text-sm mt-1">{meta.error}</div>
  );
}
