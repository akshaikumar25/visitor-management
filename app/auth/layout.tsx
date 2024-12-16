import type { Metadata } from "next";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to access your account. Enter your credentials to proceed.",
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="w-full h-full flex flex-row justify-center items-center">
          <div className="w-full h-full bg-white">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;