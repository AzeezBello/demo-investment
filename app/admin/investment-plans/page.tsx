'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface InvestmentPlan {
  id: string;
  name: string;
  roi: number;
  duration: string;
  min_amount: number;
}

const PAGE_SIZE = 10;

export default function AdminInvestmentPlansPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [page, setPage] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [roi, setRoi] = useState<number>(0);
  const [duration, setDuration] = useState('');
  const [minAmount, setMinAmount] = useState<number>(0);

  // Fetch plans with pagination
  const fetchPlans = async () => {
    const { data, count, error } = await supabase
      .from('investment_plans')
      .select('*', { count: 'exact' })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
      .order('created_at', { ascending: false });

    if (error) return toast.error(error.message);
    setPlans(data || []);
    setTotalPlans(count || 0);
  };

  useEffect(() => { fetchPlans(); }, [page]);

  // Open popover for create or edit
  const openPopover = (plan?: InvestmentPlan) => {
    if (plan) {
      setActivePlanId(plan.id);
      setName(plan.name);
      setRoi(plan.roi);
      setDuration(plan.duration);
      setMinAmount(plan.min_amount);
    } else {
      setActivePlanId(null);
      setName('');
      setRoi(0);
      setDuration('');
      setMinAmount(0);
    }
    setIsPopoverOpen(true);
  };

  // Close popover
  const closePopover = () => setIsPopoverOpen(false);

  // Save (create or update) plan
  const savePlan = async () => {
    if (!name || !roi || !duration || !minAmount) {
      return toast.error('All fields are required');
    }

    if (activePlanId) {
      // Update existing plan
      const { error } = await supabase
        .from('investment_plans')
        .update({ name, roi, duration, min_amount: minAmount })
        .eq('id', activePlanId);

      if (error) return toast.error(error.message);
      toast.success('Investment Plan updated!');
    } else {
      // Create new plan
      const { error } = await supabase
        .from('investment_plans')
        .insert({ name, roi, duration, min_amount: minAmount });

      if (error) return toast.error(error.message);
      toast.success('Investment Plan created!');
    }

    closePopover();
    fetchPlans();
  };

  // Delete plan
  const deletePlan = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    const { error } = await supabase.from('investment_plans').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Plan deleted');
    fetchPlans();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investment Plans</h1>
        <button
          onClick={() => openPopover()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Add New Plan
        </button>
      </div>

      {/* Plans Table */}
      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">ROI %</th>
            <th className="p-3 text-left">Duration</th>
            <th className="p-3 text-left">Min Amount</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{plan.name}</td>
              <td className="p-3">{plan.roi}</td>
              <td className="p-3">{plan.duration}</td>
              <td className="p-3">${plan.min_amount}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => openPopover(plan)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {Math.ceil(totalPlans / PAGE_SIZE)}</span>
        <button
          disabled={page >= Math.ceil(totalPlans / PAGE_SIZE)}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Popover */}
      {isPopoverOpen && (
        <div className="absolute top-20 right-10 w-96 bg-white border shadow-lg rounded-lg p-6 z-50">
          <h2 className="text-xl font-bold mb-4">
            {activePlanId ? 'Edit Investment Plan' : 'Add Investment Plan'}
          </h2>
          <input
            type="text"
            placeholder="Plan Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="number"
            placeholder="ROI %"
            value={roi}
            onChange={e => setRoi(Number(e.target.value))}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            placeholder="Duration"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="number"
            placeholder="Minimum Amount"
            value={minAmount}
            onChange={e => setMinAmount(Number(e.target.value))}
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={closePopover}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={savePlan}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {activePlanId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
