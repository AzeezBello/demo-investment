'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: 'open' | 'closed';
  created_at: string;
}

const PAGE_SIZE = 10;

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  const fetchTickets = async () => {
    let query = supabase
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (filter !== 'all') query = query.eq('status', filter);
    if (search) query = query.ilike('subject', `%${search}%`);

    const { data, count, error } = await query;
    if (error) return toast.error(error.message);

    setTickets(data || []);
    setTotalTickets(count || 0);
  };

  useEffect(() => {
    fetchTickets();
  }, [page, filter, search]);

  const toggleStatus = async (ticket: Ticket) => {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status: ticket.status === 'open' ? 'closed' : 'open' })
      .eq('id', ticket.id);
    if (error) return toast.error(error.message);
    toast.success(`Ticket ${ticket.status === 'open' ? 'closed' : 'opened'}`);
    fetchTickets();
  };

  const deleteTicket = async (id: string) => {
    if (!confirm('Delete this ticket?')) return;
    const { error } = await supabase.from('support_tickets').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Ticket deleted');
    fetchTickets();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        {['all', 'open', 'closed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 rounded ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="p-2 border">{ticket.user_id}</td>
              <td className="p-2 border">{ticket.subject}</td>
              <td className="p-2 border">{ticket.status}</td>
              <td className="p-2 border flex gap-2">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                  onClick={() => toggleStatus(ticket)}
                >
                  {ticket.status === 'open' ? 'Close' : 'Open'}
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => deleteTicket(ticket.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded">
          Prev
        </button>
        <span>Page {page} of {Math.ceil(totalTickets / PAGE_SIZE)}</span>
        <button
          disabled={page >= Math.ceil(totalTickets / PAGE_SIZE)}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
