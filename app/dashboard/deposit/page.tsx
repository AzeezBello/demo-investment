'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { SummaryCard, TransactionForm } from '../../components/dashboard/DashboardCards';
import toast from 'react-hot-toast';

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('Bitcoin');
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user profile balance
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) return toast.error('User not logged in.');
      setUserId(userData.user.id);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userData.user.id)
        .single();

      if (profileError) return toast.error('Failed to fetch profile.');
      setBalance(profileData?.balance || 0);
    };

    fetchProfile();
  }, []);

  // Handle deposit → redirect to confirm page
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) return toast.error('Enter a valid amount.');

    router.push(`/dashboard/deposit/confirm?amount=${depositAmount}&currency=${currency}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SummaryCard title="Account Balance" value={balance} />

      <TransactionForm
        type="deposit"
        amount={amount}
        setAmount={setAmount}
        currency={currency}
        setCurrency={setCurrency}
        onSubmit={handleDeposit}
        isDisabled={!userId}
        loading={false}
      />
    </div>
  );
}
