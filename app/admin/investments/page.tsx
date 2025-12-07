'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

/* ============================================
   Types
============================================ */

interface RawInvestment {
  id: string;
  user_id: string;
  amount: number;
  roi: number;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
}

interface Investment {
  id: string;
  user_email: string;
  amount: number;
  created_at: string;
  roi: number;
}

/* ============================================
   Component
============================================ */

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

  /* ============================================
     Fetch Investments (Fully Typed)
  ============================================ */
  const fetchInvestments = async () => {
    try {
      // Fetch investments
      const { data: rawInvestments, error: invError } = (await supabase
        .from('investments')
        .select('id, user_id, amount, roi, created_at')
        .order('created_at', { ascending: false })) as {
        data: RawInvestment[] | null;
        error: any;
      };

      if (invError) throw invError;

      const investmentsList = rawInvestments || [];

      // Extract user IDs
      const userIds = investmentsList.map((i: RawInvestment) => i.user_id);

      // Fetch user profiles
      const { data: profiles, error: profileError } = (await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds)) as {
        data: Profile[] | null;
        error: any;
      };

      if (profileError) throw profileError;

      const profileMap: Record<string, string> = {};
      profiles?.forEach((u) => {
        profileMap[u.id] = u.email;
      });

      // Combine and map final structure
      const mapped: Investment[] = investmentsList.map((i) => ({
        id: i.id,
        user_email: profileMap[i.user_id] || 'N/A',
        amount: i.amount,
        roi: i.roi,
        created_at: i.created_at,
      }));

      // Apply search filter
      const filtered = mapped.filter((i) =>
        i.user_email.toLowerCase().includes(search.toLowerCase())
      );

      setInvestments(filtered);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load investments');
    }
  };

  /* ============================================
     Render
  ============================================ */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Investments</h1>

      <input
        placeholder="Search user email"
        className="border rounded px-4 py-2 w-full md:w-1/3 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
            {investments.map((i) => (
              <tr key={i.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2">{i.user_email}</td>
                <td className="px-4 py-2 text-blue-600 font-semibold">
                  ${i.amount}
                </td>
                <td className="px-4 py-2 text-green-700 font-semibold">
                  {i.roi}%
                </td>
                <td className="px-4 py-2">
                  {new Date(i.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
