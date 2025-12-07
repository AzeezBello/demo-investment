'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUserData } from '../../lib/useUserData';
import toast from 'react-hot-toast';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  created_at: string;
}

export default function SupportPage() {
  const { profile, loading } = useUserData();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  // ✅ Guard against null profile
  useEffect(() => {
    if (!profile) return; // don't fetch if no profile
    fetchTickets();
  }, [profile]);

  const fetchTickets = async () => {
    if (!profile) return; // extra safety
    const { data, error } = (await supabase
      .from('support_tickets') // removed generic <Ticket>
      .select('*')
      .eq('user_id', (profile as any).id)
      .order('created_at', { ascending: false })) as { data: Ticket[] | null; error: any };

    if (error) toast.error(error.message);
    else setTickets(data || []);
  };

  const handleCreateTicket = async () => {
    if (!profile) return;
    if (!newTicket.subject || !newTicket.message) return toast.error('Fill all fields');

    setSubmitting(true);
    const { error } = await supabase.from('support_tickets').insert([
      { ...newTicket, user_id: profile.id, status: 'open' },
    ]);

    if (error) toast.error(error.message);
    else {
      toast.success('Ticket created!');
      setNewTicket({ subject: '', message: '' });
      fetchTickets();
    }
    setSubmitting(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>User profile not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Subject"
          value={newTicket.subject}
          onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Message"
          value={newTicket.message}
          onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleCreateTicket}
          disabled={submitting}
          className="bg-red-700 text-white px-4 py-2 rounded"
        >
          {submitting ? 'Submitting...' : 'Create Ticket'}
        </button>
      </div>

      <div className="space-y-2">
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="border p-2 rounded">
              <p className="font-semibold">{t.subject}</p>
              <p>{t.message}</p>
              <p className="text-sm text-gray-500">Status: {t.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
