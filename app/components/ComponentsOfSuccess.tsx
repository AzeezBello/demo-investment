export default function ComponentsOfSuccess() {
  const items = [
    {
      title: "Liquidity",
      desc: "Instant withdrawals and stable investment flows.",
    },
    {
      title: "Strategy",
      desc: "Data-driven market insights and portfolio diversification.",
    },
    {
      title: "Security",
      desc: "End-to-end encryption and multi-layered protection.",
    },
    {
      title: "Experience",
      desc: "11 years of financial market expertise.",
    },
  ];

  return (
    <section className="bg-gray-50 text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-10">
        Components of Our Success
      </h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 px-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 shadow rounded-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              {item.title}
            </h3>
            <p className="text-gray-700">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
