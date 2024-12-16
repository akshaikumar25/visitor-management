// /pages/auth/error.tsx
import { useRouter } from "next/router";
import Link from "next/link";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessage = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email inbox.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Error</h1>
      <p className="text-red-500 mb-4">
        {errorMessage[error as keyof typeof errorMessage] ||
          errorMessage.default}
      </p>
      <Link href="/auth/signin">
        <a className="text-blue-500">Go back to Sign In</a>
      </Link>
    </div>
  );
}
