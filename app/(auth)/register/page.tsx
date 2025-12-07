'use client';

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from 'next/navigation';
import Link from "next/link";

interface FormState {
  fullName: string;
  username: string;
  email: string;
  btcAddress: string;
  password: string;
  confirmPassword: string;
  secretQuestion: string;
  secretAnswer: string;
  agree: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  
    // Redirect if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      if (res?.data?.session) {
        checkUserRole(res.data.session.user.id);
      }
    });
  }, []);

  const checkUserRole = async (userId: string) => {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (profile?.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };
  
  const [form, setForm] = useState<FormState>({
    fullName: "",
    username: "",
    email: "",
    btcAddress: "",
    password: "",
    confirmPassword: "",
    secretQuestion: "",
    secretAnswer: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      setErrorMsg("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Step 1: Sign up user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            username: form.username,
            btc_address: form.btcAddress,
            secret_question: form.secretQuestion,
            secret_answer: form.secretAnswer,
          },
        },
      });

      if (error) throw error;

      // ✅ Step 2: Create user profile in "profiles" table
      if (data?.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email: form.email,
              role: "user",
              suspended: false,
              full_name: form.fullName,
              username: form.username,
              btc_address: form.btcAddress,
              secret_question: form.secretQuestion,
              secret_answer: form.secretAnswer,
            },
          ]);

        if (profileError) throw profileError;
      }

      setSuccessMsg(
        "Registration successful! Please check your email to confirm your account."
      );

      setForm({
        fullName: "",
        username: "",
        email: "",
        btcAddress: "",
        password: "",
        confirmPassword: "",
        secretQuestion: "",
        secretAnswer: "",
        agree: false,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-2">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join{" "}
          <span className="text-red-700 font-semibold">
            Demo-Investment
          </span>{" "}
          and start your journey today.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <InputField label="Username" name="username" value={form.username} onChange={handleChange} />
          <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
          <InputField label="Bitcoin Wallet Address" name="btcAddress" value={form.btcAddress} onChange={handleChange} />
          <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          <InputField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
          <InputField label="Secret Question" name="secretQuestion" value={form.secretQuestion} onChange={handleChange} />
          <InputField label="Secret Answer" name="secretAnswer" value={form.secretAnswer} onChange={handleChange} />

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1"
            />
            <label className="text-sm text-gray-700">
              I have read and agree with the{" "}
              <Link href="/terms" className="text-red-700 hover:underline">
                Terms and Conditions
              </Link>
              .
            </label>
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded-md">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="text-green-600 text-sm bg-green-50 border border-green-200 p-2 rounded-md">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-all ${
              loading ? "bg-red-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-red-700 font-medium hover:underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

/* === Reusable Input Field Component === */
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none"
      />
    </div>
  );
}
