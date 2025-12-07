'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface Deposit {
  id: string;
  user_email: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    fetchDeposits();

    const channel = supabase
      .channel('deposits-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits' }, fetchDeposits)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [search, page]);

  const fetchDeposits = async () => {
    try {
      const { data: deposits } = await supabase
        .from('deposits')
        .select('id, user_id, amount, status, created_at')
        .order('created_at', { ascending: false });

      const userIds = deposits?.map((d: any) => d.user_id) || [];
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      const emailMap: Record<string, string> = {};
      users?.forEach(u => (emailMap[u.id] = u.email));

      const mapped = (deposits || []).map(d => ({
        id: d.id,
        user_email: emailMap[d.user_id] || 'N/A',
        amount: d.amount,
        status: d.status,
        created_at: d.created_at,
      }));

      const filtered = mapped.filter(d =>
        d.user_email.toLowerCase().includes(search.toLowerCase())
      );

      const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
      setDeposits(paginated);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load deposits');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('deposits').update({ status }).eq('id', id);
      if (error) throw error;
      toast.success(`Deposit ${status}`);
      setEditingId(null);
      fetchDeposits();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deposits</h1>

      <div className="mb-4 flex items-center gap-4">
        <input
          placeholder="Search user email"
          className="border rounded px-4 py-2 w-full md:w-1/3"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">User Email</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(d => (
              <tr key={d.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2">{d.user_email}</td>
                <td className="px-4 py-2 text-green-600 font-semibold">${d.amount}</td>
                <td className="px-4 py-2">
                  {editingId === d.id ? (
                    <select
                      className="border rounded px-2 py-1"
                      value={newStatus || d.status}
                      onChange={e => setNewStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <span className={`font-semibold px-2 py-1 rounded ${statusBadge(d.status)}`}>
                      {d.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">{new Date(d.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  {editingId === d.id ? (
                    <>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleStatusChange(d.id, newStatus || d.status)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-indigo-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        setEditingId(d.id);
                        setNewStatus(d.status);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={deposits.length < pageSize}
          onClick={() => setPage(prev => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
