'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('Verifying...');

  const checkUserRole = async (userId: string) => {
    const { data: profile } = (await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()) as { data: { role?: string } | null };
    if (profile?.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) checkUserRole(data.session.user.id);
    });
  }, []);

  useEffect(() => {
    // Read token and email from the URL search params (client-side)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (!token || !email) {
      setStatus('Invalid verification link');
      return;
    }

    supabase.auth
      .verifyOtp({ type: 'signup', token, email })
      .then(({ error }) => {
        if (error) setStatus('Verification failed');
        else setStatus('Email successfully verified!');
      })
      .catch(() => setStatus('Verification failed'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold text-primary">{status}</h2>
      </div>
    </div>
  );
}