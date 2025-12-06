export default function WhatWeOffer() {
  const items = [
    {
      title: "Smart Investments",
      text: "Automated and human-assisted trading options for maximum profit.",
    },
    {
      title: "Analytics Dashboard",
      text: "Track and manage your portfolio in real-time with AI-driven insights.",
    },
  ];

  return (
    <section className="bg-black text-white text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-10">
        What We Offer to You
      </h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-6">
        {items.map((item) => (
          <div key={item.title} className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
