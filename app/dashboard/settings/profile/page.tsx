'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface UserProfile {
  full_name?: string;
  username?: string;
  email?: string;
  btc_address?: string;
  // add other fields present in your profiles table as optional if needed
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, username, email, btc_address')
      .eq('id', userData.user.id)
      .single();

    if (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } else {
      setProfile(data as UserProfile);
    }
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        username: profile.username,
        btc_address: profile.btc_address,
      })
      .eq('id', userData.user.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">Loading profile...</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Profile Settings
      </h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={profile?.full_name || ''}
            onChange={handleChange}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={profile?.username || ''}
            onChange={handleChange}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (read-only)
          </label>
          <input
            type="email"
            value={profile?.email || ''}
            readOnly
            className="w-full border rounded-md p-3 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bitcoin Wallet Address
          </label>
          <input
            type="text"
            name="btc_address"
            value={profile?.btc_address || ''}
            onChange={handleChange}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-md text-white font-semibold transition-all ${
            saving
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-700 hover:bg-red-800'
          }`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
