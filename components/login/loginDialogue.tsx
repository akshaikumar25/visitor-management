import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import lottieJson from "@/public/lottie/a4.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = ({ isOpen, onClose }: any) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const generateOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
  };

  const handleLogin = () => {
    if (otp === generatedOtp) {
      alert("Login successful!");
      router.push("/dashboard"); // Redirect to the dashboard
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl h-[60vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="w-full md:w-1/2 p-6">
            <Lottie
              animationData={lottieJson}
              className="w-full h-[400px]" // Using Tailwind classes for size
            />
          </div>
          {/* Right Column */}
          <div className="w-full md:w-1/2 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Login with Phone</CardTitle>
                <CardDescription>
                  Enter your phone number to log in.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button
                  className="bg-black text-white hover:bg-gray-700"
                  onClick={generateOtp}
                  disabled={otpSent}
                >
                  {otpSent ? "OTP Sent" : "Generate OTP"}
                </Button>
                {otpSent && (
                  <div className="space-y-1 mt-4">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
              {otpSent && (
                <CardFooter>
                  <Button
                    className="bg-black text-white hover:bg-gray-700"
                    onClick={handleLogin}
                    disabled={!otpSent || !otp}
                  >
                    Login
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
