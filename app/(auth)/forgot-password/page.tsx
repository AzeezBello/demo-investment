'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // ✅ Send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccessMsg(
        'A password reset link has been sent to your email address. Please check your inbox.'
      );
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your email address, and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="your@email.com"
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
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          Remembered your password?{' '}
          <Link href="/login" className="text-red-700 font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
