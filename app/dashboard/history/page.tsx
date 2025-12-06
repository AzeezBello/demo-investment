'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUserData } from '../../lib/useUserData';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Investment';
  amount: number;
  status: string;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const { user } = useUserData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<'All' | 'Deposit' | 'Withdrawal' | 'Investment'>('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const [{ data: deposits }, { data: withdrawals }, { data: investments }] = await Promise.all([
        supabase.from('deposits').select('*').eq('user_id', user.id),
        supabase.from('withdrawals').select('*').eq('user_id', user.id),
        supabase.from('investments').select('*').eq('user_id', user.id),
      ]);

      const combined: Transaction[] = [
        ...(deposits ?? []).map(d => ({ ...d, type: 'Deposit' })),
        ...(withdrawals ?? []).map(w => ({ ...w, type: 'Withdrawal' })),
        ...(investments ?? []).map(i => ({ ...i, type: 'Investment' })),
      ];

      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTransactions(combined);
      setFiltered(combined);
    } catch (err: any) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    if (!user?.id) return;

    const depositsSub = supabase
      .channel(`public:deposits:user_id=eq.${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits', filter: `user_id=eq.${user.id}` }, fetchHistory)
      .subscribe();

    const withdrawalsSub = supabase
      .channel(`public:withdrawals:user_id=eq.${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals', filter: `user_id=eq.${user.id}` }, fetchHistory)
      .subscribe();

    const investmentsSub = supabase
      .channel(`public:investments:user_id=eq.${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments', filter: `user_id=eq.${user.id}` }, fetchHistory)
      .subscribe();

    return () => {
      supabase.removeChannel(depositsSub);
      supabase.removeChannel(withdrawalsSub);
      supabase.removeChannel(investmentsSub);
    };
  }, [user?.id]);

  useEffect(() => {
    if (filterType === 'All') {
      setFiltered(transactions);
    } else {
      setFiltered(transactions.filter(tx => tx.type === filterType));
    }
    setPage(1);
  }, [filterType, transactions]);

  const getRowClass = (type: string) => {
    switch (type) {
      case 'Deposit':
        return 'bg-green-50 hover:bg-green-100';
      case 'Withdrawal':
        return 'bg-red-50 hover:bg-red-100';
      case 'Investment':
        return 'bg-blue-50 hover:bg-blue-100';
      default:
        return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const startIdx = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  if (loading) return <p className="text-center mt-20">Loading transactions...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {['All', 'Deposit', 'Withdrawal', 'Investment'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-3 py-1 rounded-full font-medium transition ${
              filterType === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {paginated.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginated.map(tx => (
                <tr key={tx.id} className={`${getRowClass(tx.type)} transition-colors duration-200`}>
                  <td className="px-6 py-4 font-medium">{tx.type}</td>
                  <td className="px-6 py-4 text-right font-semibold">${Number(tx.amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
