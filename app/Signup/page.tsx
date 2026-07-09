"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextGenerateEffect from "../../components/TextGenerate";
import { useDispatch } from "react-redux";
import { initializeAuth } from "../../components/Redux/Slice/authSlice";
import { AppDispatch } from "../../components/Redux/Store";
import Link from "next/link";

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [formdata, setFormData] = React.useState({
    name: "",
    email: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = React.useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generateOTP = async () => {
    if (!formdata.name || !formdata.email) {
      toast.warn("Please enter a valid name and email.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formdata.email, name: formdata.name, isSignup: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        toast.success("OTP sent to your email. Please check your inbox.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(data.error || "Failed to send OTP", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      toast.error(`Failed to send OTP: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const verifyOTP = async () => {
    if (!formdata.otp) {
      toast.warn("Please enter the OTP.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formdata.email, otp: formdata.otp }),
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(initializeAuth());
        toast.success("Signup successful! Redirecting to the dashboard...", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => router.push("/"), 3000);
      } else {
        toast.error(data.error || "Failed to verify OTP", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      toast.error(`Failed to verify OTP: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-auto z-50">
        <div className="flex items-center justify-center w-full h-full px-4 md:px-0 z-20">
          <div className="flex flex-col items-center justify-center w-full px-4 py-8 text-white font-sans lg:py-0 md:w-2/3 lg:w-1/3 mt-10 mb-10">
            <div className="w-full border border-white/20 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-2xl  ">
              <div className="p-6 space-y-4 sm:p-8">
                <span className="text-3xl font-semibold leading-tight tracking-tight text-center md:text-3xl ">
                  <TextGenerateEffect
                    duration={2}
                    filter={true}
                    words={"Sign Up for Flixie"}
                  />
                </span>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">
                    Name
                  </label>
                  <input
                    placeholder="John Doe"
                    className="bg-black/20 border border-white/20 text-white text-sm md:text-base rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-white/50 outline-none text-center"
                    id="name"
                    type="text"
                    name="name"
                    value={formdata.name}
                    onChange={handleChange}
                    disabled={otpSent}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">
                    Email
                  </label>
                  <input
                    placeholder="eternalfaith@gmail.com"
                    className="bg-black/20 border border-white/20 text-white text-sm md:text-base rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-white/50 outline-none text-center"
                    id="email"
                    type="email"
                    name="email"
                    value={formdata.email}
                    onChange={handleChange}
                    disabled={otpSent}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !otpSent) {
                        generateOTP();
                      }
                    }}
                  />
                </div>
                {otpSent && (
                  <div>
                    <label className="block mb-1 text-sm md:text-md font-light mt-4">
                      OTP
                    </label>
                    <input
                      placeholder="One Time Password"
                      className="bg-black/20 border border-white/20 text-white text-sm md:text-base rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-white/60 outline-none text-center"
                      id="otp"
                      type="text"
                      name="otp"
                      value={formdata.otp}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          verifyOTP();
                        }
                      }}
                    />
                  </div>
                )}
                {!otpSent ? (
                  <button
                    className="mt-8 w-full border border-white/20 bg-white/10 hover:bg-white/5 focus:ring-1 focus:outline-none focus:ring-white/50 rounded-lg text-sm md:text-base px-5 py-2.5 text-center text-white transition-all duration-300"
                    onClick={generateOTP}
                  >
                    Get OTP
                  </button>
                ) : (
                  <button
                    className="mt-8 w-full border border-white/20 bg-white/10 hover:bg-white/5 focus:ring-1 focus:outline-none focus:ring-white/50 rounded-lg text-sm md:text-base px-5 py-2.5 text-center text-white transition-all duration-300"
                    onClick={verifyOTP}
                  >
                    Complete Signup
                  </button>
                )}
                <div className="mt-6 text-center text-sm">
                  <p>Already have an account? <Link href="/Login" className="text-blue-400 hover:underline">Log in</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
