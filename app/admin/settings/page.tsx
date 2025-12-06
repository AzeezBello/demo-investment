'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, User, Settings, Bell } from 'lucide-react';

const tabs = [
  {
    name: 'Profile',
    href: '/dashboard/settings/profile',
    icon: User,
    description: 'Manage your personal information and wallet details.',
  },
  {
    name: 'Security',
    href: '/dashboard/settings/security',
    icon: Shield,
    description: 'Change your password and secure your account.',
  },
  { 
    name: 'Notifications', 
    href: '/dashboard/settings/notifications', 
    icon: Bell, 
    description: 'Manage alerts and email preferences.'},

  { 
    name: 'Preferences', 
    href: '/dashboard/settings/preferences', 
    icon: Settings 
    , description: 'Set your account preferences and display options.'},

];

export default function SettingsPage() {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your profile, security, and account preferences.
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="grid md:grid-cols-2 gap-6">
        {tabs.map((tab, idx) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link key={idx} href={tab.href}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-start space-x-4 border rounded-xl p-5 transition-all ${
                  isActive
                    ? 'border-red-700 bg-red-50 shadow-sm'
                    : 'border-gray-200 hover:border-red-400 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`p-3 rounded-full ${
                    isActive ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      isActive ? 'text-red-700' : 'text-gray-800'
                    }`}
                  >
                    {tab.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{tab.description}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        Need help?{' '}
        <Link
          href="/dashboard/support"
          className="text-red-700 hover:underline font-medium"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
