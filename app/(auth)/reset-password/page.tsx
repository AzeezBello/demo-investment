'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // ✅ Supabase handles token validation from the magic link
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setSuccessMsg('Your password has been updated successfully.');
      setPassword('');
      setConfirmPassword('');

      // Redirect user after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <Header />
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-2">
          Reset Password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter and confirm your new password below.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Confirm new password"
            />
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
              loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'
            }`}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          <Link href="/login" className="text-red-700 font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
