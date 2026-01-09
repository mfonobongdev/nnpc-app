import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-xs grid place-items-center h-screen">
        <LoginForm />
      </div>
    </div>
  );
}
