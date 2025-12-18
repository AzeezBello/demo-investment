'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { SummaryCard, TransactionForm } from '../../components/dashboard/DashboardCards';

interface WithdrawalRow {
  amount: number;
  status: string | null;
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [currency, setCurrency] = useState<string>('Bitcoin');
  const [balance, setBalance] = useState<number>(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Fetch user wallet & balance info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) throw new Error('User not logged in');

        const userId = user.id;

        // Fetch wallet info & balance
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('wallet_address, balance')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        setWalletAddress(profile?.wallet_address || '');
        setBalance(profile?.balance || 0);

        // Fetch pending withdrawals
        const { data: withdrawals } = (await supabase
          .from('withdrawals')
          .select('amount, status')
          .eq('user_id', userId)) as { data: WithdrawalRow[] | null };

        const pendingTotal =
          (withdrawals ?? [])
            .filter((w) => w.status === 'processing')
            .reduce((sum, w) => sum + w.amount, 0) || 0;

        setPendingWithdrawals(pendingTotal);
      } catch (err: any) {
        console.error('Error fetching user data:', err.message);
        setMessage('⚠️ Unable to load account data.');
      }
    };

    fetchUserData();
  }, []);

  // Handle withdraw form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error('User not logged in');

      const userId = user.id;
      const withdrawAmount = parseFloat(amount);

      if (!withdrawAmount || withdrawAmount <= 0)
        throw new Error('Enter a valid amount.');
      if (withdrawAmount > balance) throw new Error('Insufficient funds.');

      const { error: insertError } = await supabase.from('withdrawals').insert({
        user_id: userId,
        amount: withdrawAmount,
        currency,
        wallet_address: walletAddress,
        status: 'processing',
        created_at: new Date(),
      });

      if (insertError) throw insertError;

      // Deduct balance
      const newBalance = balance - withdrawAmount;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update UI
      setBalance(newBalance);
      setPendingWithdrawals((prev) => prev + withdrawAmount);
      setAmount('');
      setMessage('✅ Withdrawal request submitted successfully.');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = balance <= 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Account Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <SummaryCard title="Account Balance" value={balance} />
        <SummaryCard title="Pending Withdrawals" value={pendingWithdrawals} />
        <SummaryCard
          title="Wallet Address"
          value={walletAddress || 'Not set'}
          isMonospace
        />
      </div>

      {/* Withdraw Form */}
      <TransactionForm
        type="withdraw"
        amount={amount}
        setAmount={setAmount}
        currency={currency}
        setCurrency={setCurrency}
        onSubmit={handleSubmit}
        isDisabled={isDisabled}
        loading={loading}
      />

      {/* Messages */}
      {message && (
        <div
          className={`text-center font-medium ${
            message.startsWith('✅')
              ? 'text-green-600'
              : message.startsWith('⚠️')
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      {isDisabled && !message && (
        <div className="text-center text-gray-600 font-medium bg-yellow-50 border border-yellow-200 py-3 rounded-lg">
          You have no funds to withdraw.
        </div>
      )}
    </div>
  );
}
