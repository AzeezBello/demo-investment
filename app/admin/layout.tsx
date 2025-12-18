'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LucideIcon, Users, Settings, List, Bell, Home, LifeBuoy, LogOut, User, DollarSign, Vault, } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface SidebarItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Overview', href: '/admin', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Deposits', href: '/admin/deposits', icon: Vault },
  { name: 'Withdrawals', href: '/admin/withdrawals', icon: DollarSign },
  { name: 'Investments', href: '/admin/investments', icon: List },
  { name: 'Investment Plans', href: '/admin/investment-plans', icon: List },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Support', href: '/admin/support', icon: LifeBuoy },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Fetch user profile and notifications
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let isMounted = true;

    const initDashboard = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user || !isMounted) return;

      const userId = userData.user.id;

      // Fetch user's full name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      if (!isMounted) return;
      if (profile?.full_name) setUserName(profile.full_name);

      // Fetch initial notifications
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!isMounted) return;
      if (notifData) {
        setNotifications(notifData);
        setUnreadCount(notifData.filter((n: any) => !n.read).length);
      }

      // Subscribe to real-time notifications (Supabase v2)
      if (!isMounted) return;
      channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload: any) => {
            if (!isMounted) return;
            setNotifications((prev) => [payload.new, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        )
        .subscribe();
    };

    void initDashboard();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleNotifDropdown = () => setIsNotifOpen((prev) => !prev);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md">
        {/* Brand Header */}
        <div className="px-6 py-3 border-b border-gray-800 hidden md:block">
          <h4 className="text-xl font-bold text-red-500">Demo-Investment</h4>
          <p className="text-sm text-gray-400">Admin Dashboard</p>
        </div>
        <nav className="mt-6">
          {sidebarItems.map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 rounded">
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-end items-center bg-white p-4 shadow relative space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifDropdown}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md py-2 z-50 max-h-96 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No notifications
                  </p>
                )}
                {notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${!n.read ? 'font-semibold' : ''}`}
                  >
                    {n.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer"
            >
              <User size={20} />
              <span>{userName}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                <Link
                  href="/dashboard/settings/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings/security"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
