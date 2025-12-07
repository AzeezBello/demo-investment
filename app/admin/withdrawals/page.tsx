'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

/** Raw DB types returned by Supabase */
interface RawWithdrawal {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface RawProfile {
  id: string;
  email: string;
}

/** Final withdrawal shape used in the UI */
interface Withdrawal {
  id: string;
  user_email: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();

    const channel = supabase
      .channel('withdrawals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'withdrawals' },
        fetchWithdrawals
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [search, page]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);

      // ---- 1. FETCH RAW WITHDRAWALS ----
      const { data: rawWithdrawals, error } = await supabase
        .from('withdrawals')
        .select('id, user_id, amount, status, created_at')
        .order('created_at', { ascending: false }) as {
        data: RawWithdrawal[] | null;
        error: any;
      };

      if (error) throw error;

      const userIds =
        rawWithdrawals?.map((w: RawWithdrawal) => w.user_id) || [];

      // ---- 2. FETCH USER EMAILS ----
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds) as { data: RawProfile[] | null };

      // Build lookup table
      const emailMap: Record<string, string> = {};
      users?.forEach((u: RawProfile) => {
        emailMap[u.id] = u.email;
      });

      // ---- 3. MAP RAW RESULTS TO UI-FRIENDLY FORMAT ----
      const mapped: Withdrawal[] =
        rawWithdrawals?.map((w: RawWithdrawal) => ({
          id: w.id,
          user_email: emailMap[w.user_id] || 'N/A',
          amount: w.amount,
          status: w.status,
          created_at: w.created_at,
        })) || [];

      // ---- 4. SEARCH FILTER ----
      const filtered = mapped.filter((w: Withdrawal) =>
        w.user_email.toLowerCase().includes(search.toLowerCase())
      );

      // ---- 5. PAGINATION ----
      const paginated = filtered.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

      setWithdrawals(paginated);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Status updated to ${newStatus}`);
      setEditingId(null);
      fetchWithdrawals();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Withdrawals Management</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          placeholder="Search user email..."
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">User Email</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : withdrawals.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No withdrawals found.
                </td>
              </tr>
            ) : (
              withdrawals.map((w: Withdrawal) => (
                <tr key={w.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{w.user_email}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    ${w.amount}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === w.id ? (
                      <select
                        value={w.status}
                        onChange={(e) =>
                          updateStatus(w.id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => setEditingId(w.id)}
                        className={`cursor-pointer inline-block px-2 py-1 rounded-md text-xs font-semibold ${statusBadge(
                          w.status
                        )}`}
                        title="Click to edit"
                      >
                        {w.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(w.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <button
                      onClick={() =>
                        setEditingId(
                          editingId === w.id ? null : w.id
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {editingId === w.id ? 'Cancel' : 'Edit'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={withdrawals.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
