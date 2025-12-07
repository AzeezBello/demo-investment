'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export interface UserProfile {
  id?: string;
  full_name?: string;
  email?: string;
  balance: number;
  total_deposits: number;
  total_withdrawals: number;
  earnings: number;
  pending_withdrawals: number;
}

export function useUserData() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUserData = async () => {
      setLoading(true);

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const session = sessionData.session;
        if (!session?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            full_name,
            balance,
            total_deposits,
            total_withdrawals,
            earnings
          `)
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch pending withdrawals
        const { data: pendingWithdrawalsData, error: pendingError } = await supabase
          .from('withdrawals')
          .select('amount')
          .eq('user_id', session.user.id)
          .eq('status', 'processing');

        if (pendingError) throw pendingError;

        const pending_withdrawals =
          pendingWithdrawalsData?.reduce((sum: number, w: any) => sum + Number(w.amount), 0) || 0;

        if (mounted) {
          setProfile({
            full_name: profileData.full_name,
            balance: Number(profileData.balance),
            total_deposits: Number(profileData.total_deposits),
            total_withdrawals: Number(profileData.total_withdrawals),
            earnings: Number(profileData.earnings),
            pending_withdrawals,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
