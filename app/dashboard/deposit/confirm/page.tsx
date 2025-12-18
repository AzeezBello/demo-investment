'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function ConfirmDepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('Bitcoin');
  const [transactionId, setTransactionId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const depositFee = 0.0; // 0% fee
  const debitAmount = amount + amount * depositFee;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get('amount') || '0';
    const parsedAmount = parseFloat(amountParam);
    setAmount(Number.isFinite(parsedAmount) ? parsedAmount : 0);
    const currencyParam = params.get('currency');
    if (currencyParam) setCurrency(currencyParam);
  }, []);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return toast.error('User not logged in.');
      setUserId(userData.user.id);
    };
    fetchUser();
  }, []);

  const handleConfirmDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return toast.error('Transaction ID is required.');
    if (!userId) return toast.error('User not authenticated.');

    try {
      await supabase.from('deposits').insert({
        user_id: userId,
        amount,
        currency,
        status: 'pending',
        transaction_id: transactionId,
        created_at: new Date().toISOString(),
      });

      toast.success(
        '✅ Deposit has been saved. It will become active when the administrator confirms it.'
      );
      router.push('/dashboard'); // Redirect to dashboard after submit
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save deposit.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">Please Confirm Your Deposit</h1>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">BTC Wallet ID:</span> bc1q083rkvg89l24f4xzpwgd4y5mwfuucypm9022g4
        </p>
        <p>
          <span className="font-semibold">Amount:</span> ${amount.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Deposit Fee:</span> {depositFee}%
        </p>
        <p>
          <span className="font-semibold">Debit Amount:</span> ${debitAmount.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleConfirmDeposit} className="space-y-4">
        <label className="block">
          <span className="font-medium">Transaction ID</span>
          <input
            type="text"
            value={transactionId}
            onChange={e => setTransactionId(e.target.value)}
            placeholder="Enter your Transaction ID"
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Confirm Deposit
        </button>
      </form>

      <p className="text-sm text-gray-600">
        The deposit will become active when the administrator confirms the payment.
      </p>
    </div>
  );
}
