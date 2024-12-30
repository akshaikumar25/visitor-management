"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
// import lottieJson from "@/public/lottie/a4.json";
import lottieJson from "@/public/lottie/login.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { loginWithCredentials, requestOtp } from "@/reducers/user.reducer";
import { toast } from "sonner";
import Image from "next/image";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP

  const generateOtp = async () => {
    setIsLoading(true);
    setOtpSent(true);
    try {
      const result = await dispatch(requestOtp(phoneNumber));
      if (requestOtp.fulfilled.match(result)) {
        toast.success("OTP sent successfully");
        setStep(2);
      } else {
        toast.error(result.payload as string);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  // const handleotpSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const otpString = otp.join("");
  //   setIsVerifying(true);
  //   try {
  //     const result = await dispatch(
  //       loginWithCredentials({ phone: phoneNumber, otp: otpString })
  //     ).unwrap();
  //     if (loginWithCredentials.fulfilled.match(result)) {
  //       toast.success("Login successfully");
  //     } else {
  //       toast.error("Failed to verify OTP or login");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to verify OTP or login");
  //   }
  // };

  const handleotpSubmit = async (e: React.FormEvent) => {
    const otpString = otp.join("");
    setIsVerifying(true);
    try {
      const result = await dispatch(
        loginWithCredentials({ phone: phoneNumber, otp: otpString })
      ).unwrap();
      if (result) {
        toast.success("Login successfully");
        router.push("/dashboard");
      } else {
        toast.error("Failed to verify OTP or login");
      }
    } catch (error) {
      toast.error("Failed to verify OTP or login");
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (step === 2) {
      otpInputs.current[0]?.focus();
    }
  }, [step]);

  return (
    <div className="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left Column */}
        <div className="w-full md:w-1/2 flex items-center justify-center  bg-blue-900">
          <Lottie
            animationData={lottieJson}
            className="w-full h-[800px] max-w-md"
          />
        </div>
        {/* Right Column */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center  bg-white">
          <Card className="w-full max-w-sm border border-gray-200  rounded-md bg-white">
            <div className="flex items-center justify-start">
              <Image src="/vms.png" alt="Visitor Icon" width={80} height={80} />
              <div className="flex flex-col mt-1">
                <span className="font-bold text-xl text-blue-900">
                  Visitor Management System
                </span>
              </div>
            </div>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-extrabold text-blue-900">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter your phone number to get started
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pr-16 border border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900 rounded-md"
                  />
                  {!otpSent && (
                    <Button
                      onClick={generateOtp}
                      disabled={isLoading || phoneNumber.length < 10}
                      className="absolute right-0 top-0 h-full px-4 rounded-l-none bg-blue-900 hover:bg-blue-900 text-white"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="space-y-4 transition-all duration-300 ease-in-out">
                  <Label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enter OTP
                  </Label>
                  <div className="flex justify-between space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el: HTMLInputElement | null) => {
                          if (el) otpInputs.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center border border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900 rounded-md"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        required
                      />
                    ))}
                  </div>

                  <Button
                    className="w-full bg-blue-900 hover:bg-blue-900 text-white"
                    onClick={handleotpSubmit}
                    disabled={isVerifying || otp.length < 6}
                  >
                    {isVerifying ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setPhoneNumber("");
                      }}
                      className="text-sm text-gray-600 hover:text-blue-900"
                    >
                      Change phone number?
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
