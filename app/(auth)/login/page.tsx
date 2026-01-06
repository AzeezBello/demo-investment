'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ✅ Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      if (res?.data?.session) checkUserRole(res.data.session.user.id);
    });
  }, []);

  // ✅ Redirect based on user role
  const checkUserRole = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // ✅ Supabase sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      if (!data.session) throw new Error('Login failed. Please try again.');

      setSuccessMsg('Login successful! Redirecting...');
      checkUserRole(data.user.id);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <Header />
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Log in to your{' '}
          <span className="text-red-700 font-semibold">Demo-Investment</span> account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

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
              loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <Link href="/register" className="text-red-700 font-medium hover:underline">
            Register
          </Link>
        </div>

        <div className="mt-4 text-sm text-center">
          <Link href="/reset-password" className="text-gray-500 hover:text-red-700">
            Forgot Password?
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

/* === Reusable Input Field === */
function InputField({
  label,
  name,
  type = 'text',
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
