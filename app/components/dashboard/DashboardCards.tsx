'use client';

import React from 'react';

export function SummaryCard({
  title,
  value,
  isMonospace,
}: {
  title: string;
  value: any;
  isMonospace?: boolean;
}) {
  return (
    <div className="bg-gray-900 text-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-400 uppercase">{title}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          isMonospace ? 'font-mono break-words text-xs md:text-sm' : ''
        }`}
      >
        {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
      </p>
    </div>
  );
}

export function TransactionForm({
  type,
  amount,
  setAmount,
  currency,
  setCurrency,
  onSubmit,
  isDisabled,
  loading,
}: {
  type: 'withdraw' | 'deposit';
  amount: string;
  setAmount: (val: string) => void;
  currency: string;
  setCurrency: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
  loading: boolean;
}) {
  const label = type === 'withdraw' ? 'Withdrawal Request' : 'Deposit Funds';
  const buttonText =
    type === 'withdraw'
      ? isDisabled
        ? 'No Funds Available'
        : 'Submit Withdrawal'
      : 'Deposit Funds';

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6"
    >
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
        {label}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Payment System:
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option>Bitcoin</option>
            <option>Ethereum</option>
            <option>USDT (TRC20)</option>
            <option>Litecoin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount ($):
          </label>
          <input
            type="number"
            min="0"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isDisabled}
            className={`border rounded-lg px-3 py-2 w-full focus:outline-none ${
              isDisabled
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'border-gray-300 focus:ring-2 focus:ring-red-600'
            }`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isDisabled || loading}
        className={`w-full md:w-auto px-8 py-2.5 rounded-lg font-semibold transition ${
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-700 hover:bg-red-800 text-white'
        }`}
      >
        {loading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
}
