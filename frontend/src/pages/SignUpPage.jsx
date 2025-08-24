import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/useAuthStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SignUpPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: ""
  })

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Vui lòng nhập tên người dùng.");
    if (!formData.email.trim()) return toast.error("Vui lòng nhập email.");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email))
      return toast.error("Email không hợp lệ.");
    if (!formData.fullName.trim())
      return toast.error("Vui lòng nhập tên đầy đủ.");
    if (!formData.password.trim()) return toast.error("Vui lòng nhập mật khẩu.");
    if (formData.password.length < 6) return toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
    
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
      signup(formData);
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div>
        {/* Left side - Image */}
        <div className="hidden lg:block mr-16">
          <img src="/assets/landing-2x.png" alt="" />
        </div>
      </div>
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/assets/Swipy.png" />
        </div>

        {/* Login form  */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-4">
          <div className="space-y-4">
            {/* username input */}
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Tên người dùng"
              className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-sm text-sm placeholder-gray-500 
                  focus:outline-none focus:border-gray-400 focus:bg-white transition-all h-auto"
            />

            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-sm text-sm placeholder-gray-500 
                  focus:outline-none focus:border-gray-400 focus:bg-white transition-all h-auto"
            />

            <Input
              type="text"
              name="fullname"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Tên đầy đủ"
              className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-sm text-sm placeholder-gray-500 
                  focus:outline-none focus:border-gray-400 focus:bg-white transition-all h-auto"
            />

            {/* password input */}
            <div className="relative z-0">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Mật khẩu"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-sm text-sm placeholder-gray-500 
                  focus:outline-none focus:border-gray-400 focus:bg-white transition-all h-auto"
              />
              {/* Show/hide password */}
              <button
                type="button"
                className="absolute right-0 inset-y-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            {/* Login button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-400 hover:bg-blue-500 text-while font-medium py-2.5 px-4 rounded-lg text-sm 
                  transition-colors disabled:cursor-not-allowed disabled:hover:bg-blue-300 h-auto"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>

            {/* Divider with Separator */}
            <div className="flex items-center my-6">
              <Separator className="flex-1" />
              <span className="px-4 text-gray-400 text-sm font-semibold">
                HOẶC
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Google Login */}
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center space-x-2 text-blue-600 font-medium text-sm py-2 hover:bg-transparent h-auto"
            >
              <svg
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  ></path>
                </g>
              </svg>
              <span>Đăng nhập bằng Google</span>
            </Button>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <Button
                variant="link"
                className="text-xs text-blue-900 hover:underline p-0 h-auto"
              >
                Quên mật khẩu?
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-700">
                Bạn đã có tài khoản ư?{" "}
                <Link
                  to={"/login"}
                  className="text-blue-500 font-medium hover:underline p-0 h-auto text-sm"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage
