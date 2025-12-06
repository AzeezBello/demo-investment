'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  suspended: boolean;
}

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    const { data, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .ilike('full_name', `%${search}%`)
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    setUsers(data || []);
    setTotalUsers(count || 0);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('User deleted');
    fetchUsers();
  };

  const toggleSuspend = async (user: UserProfile) => {
    const { error } = await supabase
      .from('profiles')
      .update({ suspended: !user.suspended })
      .eq('id', user.id);
    if (error) return toast.error(error.message);
    toast.success(user.suspended ? 'User unsuspended' : 'User suspended');
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Suspended</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border">{user.full_name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">{user.suspended ? 'Yes' : 'No'}</td>
              <td className="p-2 border flex gap-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteUser(user.id)}>Delete</button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => toggleSuspend(user)}>
                  {user.suspended ? 'Unsuspend' : 'Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
        <span>Page {page} of {Math.ceil(totalUsers / PAGE_SIZE)}</span>
        <button disabled={page >= Math.ceil(totalUsers / PAGE_SIZE)} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
}
