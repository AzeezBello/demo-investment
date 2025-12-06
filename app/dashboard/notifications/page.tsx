'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUserData } from '../../lib/useUserData';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { profile, loading } = useUserData();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ✅ Only fetch when profile is available
  useEffect(() => {
    if (!profile) return;
    fetchNotifications();
  }, [profile]);

  const fetchNotifications = async () => {
    if (!profile) return;
    const { data, error } = (await supabase
      .from('notifications') // removed generic <Notification>
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })) as { data: Notification[] | null; error: any };

    if (error) toast.error(error.message);
    else setNotifications(data || []);
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>User not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n.id} className="border p-2 rounded">
              <p className="font-semibold">{n.title}</p>
              <p>{n.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(n.created_at).toLocaleString()} - {n.read ? 'Read' : 'Unread'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
