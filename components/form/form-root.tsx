"use client";

import { Form, Formik, type FormikHelpers, type FormikValues } from "formik";
import type { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

type FormRootProps<T extends FormikValues> = {
  children: React.ReactNode;
  validationSchema: z.ZodSchema<T>;
  initialValues: T;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>,
  ) => void | Promise<void>;
};

export default function FormRoot<T extends FormikValues>({
  children,
  validationSchema,
  initialValues,
  onSubmit,
}: FormRootProps<T>) {
  return (
    <Formik<T>
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(validationSchema)}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 justify-items-center"
        >
          {children}
        </Form>
      )}
    </Formik>
  );
}
