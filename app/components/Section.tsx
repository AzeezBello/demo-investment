import React from 'react';

export default function Section({
  title,
  children,
}: {
  title?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        {title && (
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-red-700">{title}</h1>
          </header>
        )}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
