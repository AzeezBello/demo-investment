'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Stats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
}

interface ChartData {
  name: string;
  value: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
  });

  const [depositHistory, setDepositHistory] = useState<ChartData[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<ChartData[]>([]);
  const [investmentHistory, setInvestmentHistory] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Users
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact' });

        // Deposits
        const { data: deposits } = await supabase.from('deposits').select('amount, created_at');
        const totalDeposits = deposits?.reduce((acc, d) => acc + Number(d.amount), 0) || 0;

        // Withdrawals
        const { data: withdrawals } = await supabase.from('withdrawals').select('amount, created_at');
        const totalWithdrawals = withdrawals?.reduce((acc, w) => acc + Number(w.amount), 0) || 0;

        // Investments
        const { data: investments } = await supabase.from('investments').select('amount, created_at');
        const totalInvestments = investments?.reduce((acc, i) => acc + Number(i.amount), 0) || 0;

        setStats({
          totalUsers: userCount || 0,
          totalDeposits,
          totalWithdrawals,
          totalInvestments,
        });

        // Prepare chart data (monthly aggregation)
        const groupByMonth = (data: any[]) => {
          const months: Record<string, number> = {};
          data.forEach(d => {
            const month = new Date(d.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
            months[month] = (months[month] || 0) + Number(d.amount);
          });
          return Object.entries(months).map(([name, value]) => ({ name, value }));
        };

        setDepositHistory(groupByMonth(deposits || []));
        setWithdrawalHistory(groupByMonth(withdrawals || []));
        setInvestmentHistory(groupByMonth(investments || []));
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#B91C1C', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          <p className="text-xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 text-sm">Total Deposits</h2>
          <p className="text-xl font-bold">${stats.totalDeposits.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 text-sm">Total Withdrawals</h2>
          <p className="text-xl font-bold">${stats.totalWithdrawals.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 text-sm">Total Investments</h2>
          <p className="text-xl font-bold">${stats.totalInvestments.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-bold mb-2">Deposits by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={depositHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#B91C1C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-bold mb-2">Withdrawals by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={withdrawalHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white shadow rounded-lg md:col-span-2">
          <h3 className="font-bold mb-2">Investments by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={investmentHistory} dataKey="value" nameKey="name" outerRadius={100} fill="#10B981" label>
                {investmentHistory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
