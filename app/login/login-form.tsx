"use client";
import { Button } from "@base-ui/react/button";
import Image from "next/image";
import { z } from "zod";
import FormRoot from "@/components/form/form-root";
import FormTextInput from "@/components/form/form-text-input";
import Text from "@/components/text";

export default function LoginForm() {
  const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters long"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values: typeof initialValues) => {
    console.log(values);
  };

  return (
    <FormRoot<z.infer<typeof loginSchema>>
      validationSchema={loginSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col">
        <Image
          src="/assets/nnpc-logo.png"
          width={150}
          height={150}
          alt="NNPC"
          className="mx-auto"
        />
        <Text className="text-center -mt-3 mb-2" variant="Caption">
          Please enter your details to login.
        </Text>
      </div>
      <FormTextInput name="email" label="Email" />
      <FormTextInput name="password" label="Password" />
      <Button
        type="submit"
        className="h-10 w-full rounded-xl px-3.5 bg-[#226745] mt-1.5 hover:bg-[#226745]/90 text-white cursor-pointer"
      >
        <Text className="text-white" variant="Small">
          Login
        </Text>
      </Button>
    </FormRoot>
  );
}
