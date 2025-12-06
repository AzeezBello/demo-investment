'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface Investment {
  id: string;
  user_email: string;
  amount: number;
  created_at: string;
  roi: number;
}

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInvestments();

    const channel = supabase
      .channel('investments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, fetchInvestments)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [search]);

  const fetchInvestments = async () => {
    try {
      const { data: investments } = await supabase
        .from('investments')
        .select('id, user_id, amount, roi, created_at')
        .order('created_at', { ascending: false });

      const userIds = investments?.map(i => i.user_id) || [];
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      const emailMap: Record<string, string> = {};
      users?.forEach(u => (emailMap[u.id] = u.email));

      const mapped = (investments || []).map(i => ({
        id: i.id,
        user_email: emailMap[i.user_id] || 'N/A',
        amount: i.amount,
        roi: i.roi,
        created_at: i.created_at,
      }));

      setInvestments(
        mapped.filter(i =>
          i.user_email.toLowerCase().includes(search.toLowerCase())
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to load investments');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Investments</h1>

      <input
        placeholder="Search user email"
        className="border rounded px-4 py-2 w-full md:w-1/3 mb-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">User Email</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">ROI</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {investments.map(i => (
              <tr key={i.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2">{i.user_email}</td>
                <td className="px-4 py-2 text-blue-600 font-semibold">${i.amount}</td>
                <td className="px-4 py-2 text-green-700 font-semibold">{i.roi}%</td>
                <td className="px-4 py-2">{new Date(i.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
