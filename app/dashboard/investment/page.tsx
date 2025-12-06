'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUserData } from '../../lib/useUserData';
import toast from 'react-hot-toast';

export default function InvestmentPlansPage() {
  const { user, profile } = useUserData();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Popover state
  const [popoverPlan, setPopoverPlan] = useState<any | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [dailyProfit, setDailyProfit] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  // Fetch all plans
  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('investment_plans').select('*');
    if (error) toast.error(error.message);
    else setPlans(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  // Open calculator popover
  const openCalculator = (plan: any) => {
    setPopoverPlan(plan);
    const minAmount = plan.min_amount || 0;
    setInvestmentAmount(minAmount);

    calculateProfit(minAmount, plan);
  };

  // Calculate daily and total profit
  const calculateProfit = (amount: number, planOverride?: any) => {
    const plan = planOverride || popoverPlan;
    if (!plan) return;

    const roi = plan.roi || 0;
    const daily = amount * (roi / 100);
    const durationDays = parseInt(plan.duration) || 1;
    setDailyProfit(daily);
    setTotalProfit(daily * durationDays);
    setInvestmentAmount(amount);
  };

  // Close popover
  const closePopover = () => setPopoverPlan(null);

  // Handle investment
  const handleInvest = async (plan: any, amount: number) => {
    if (!user?.id) return toast.error('You must be logged in to invest');
    if (!profile) return toast.error('User profile not loaded');

    // Validate amount
    if (amount < plan.min_amount) return toast.error(`Amount must be at least $${plan.min_amount}`);
    if (amount > profile.balance) return toast.error('Insufficient balance');

    // Deduct balance first
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: profile.balance - amount })
      .eq('id', user.id);

    if (updateError) return toast.error('Failed to update balance');

    // Insert investment
    const { error: investError } = await supabase
      .from('investments')
      .insert([{ user_id: user.id, plan_id: plan.id, amount, status: 'active' }]);

    if (investError) {
      // Rollback balance if investment fails
      await supabase.from('profiles').update({ balance: profile.balance }).eq('id', user.id);
      return toast.error(investError.message);
    }

    toast.success(`Investment of $${amount} submitted!`);
    closePopover();
  };

  if (loading) return <p>Loading plans...</p>;

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">Investment Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white shadow p-4 rounded relative">
            <h2 className="font-bold text-lg">{plan.name}</h2>
            <p>Min Investment: ${plan.min_amount}</p>
            <p>ROI (Daily): {plan.roi}%</p>
            <p>Duration: {plan.duration} days</p>
            <button
              onClick={() => openCalculator(plan)}
              className="mt-2 p-2 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Calculate Your Profit &gt;
            </button>
          </div>
        ))}
      </div>

      {/* Popover Calculator */}
      {popoverPlan && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 bg-white border shadow-lg rounded-lg p-6 z-50">
          <h2 className="text-xl font-bold mb-3">{popoverPlan.name} Profit Calculator</h2>
          <p>ROI (Daily): {popoverPlan.roi}%</p>
          <p>Duration: {popoverPlan.duration} days</p>
          <p>Your Balance: ${profile?.balance?.toFixed(2) ?? 0}</p>

          <div className="flex flex-col gap-2 mt-2">
            <label>
              Investment Amount:
              <input
                type="number"
                value={investmentAmount}
                min={popoverPlan.min_amount}
                max={profile?.balance ?? 0}
                onChange={e => calculateProfit(Number(e.target.value))}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <p className="mt-2 font-semibold">
              Daily Profit: <span className="text-green-600">${dailyProfit.toFixed(2)}</span>
            </p>
            <p className="mt-1 font-semibold">
              Total Profit: <span className="text-green-700">${totalProfit.toFixed(2)}</span>
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closePopover}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => handleInvest(popoverPlan, investmentAmount)}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Invest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
