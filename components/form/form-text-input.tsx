import { Input } from "@base-ui/react/input";
import cn from "classnames";
import { useField } from "formik";
import type { ComponentProps } from "react";
import Text from "../text";
import FormErrorText from "./form-error-text";

type FormTextInputProps = ComponentProps<"input"> & {
  name: string;
  label: string;
};

export default function FormTextInput({
  name,
  label,
  ...props
}: FormTextInputProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="block" htmlFor={field.name}>
          <Text variant="Small">{label}</Text>
        </label>
      )}
      <Input
        className={cn(
          "h-10 w-full rounded-xl bg-gray-100/80 pl-3.5 text-base text-gray-700 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-400",
          { "border-red-500": hasError },
        )}
        {...field}
        {...props}
      />
      <FormErrorText name={name} />
    </div>
  );
}
