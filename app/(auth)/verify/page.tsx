'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('Verifying...');

  const checkUserRole = async (userId: string) => {
    const { data: profile } = await supabase.from<{ role: string }>('profiles').select('role').eq('id', userId).single();
    if (profile?.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) checkUserRole(data.session.user.id);
    });
  }, []);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return setStatus('Invalid verification link');

    supabase.auth.verifyOtp({ type: 'signup', token })
      .then(({ error }) => {
        if (error) setStatus('Verification failed');
        else setStatus('Email successfully verified!');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold text-primary">{status}</h2>
      </div>
    </div>
  );
}