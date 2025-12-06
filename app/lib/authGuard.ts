import { supabase } from './supabaseClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const authGuard = async (role: 'user' | 'admin') => {
  const cookieStore = cookies();
  const token = cookieStore.get('sb:token')?.value;

  if (!token) redirect('/login');

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (!profile || profile.role !== role) {
    redirect(role === 'admin' ? '/dashboard' : '/admin');
  }

  return user;
};