export default function TradingPlans() {
  const plans = [
    { title: "Starter", percent: "5%", desc: "Return after 12 hours" },
    { title: "Silver", percent: "20%", desc: "Return after 24 hours" },
    { title: "Cloud Mining", percent: "2.5% Daily", desc: "For 30 days" },
  ];

  return (
    <section className="text-center bg-gray-50">
      <h2 className="text-3xl font-bold mb-10 text-red-600">Our Trading Plans</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className="border border-gray-200 rounded-md p-6 shadow hover:shadow-lg transition bg-white"
          >
            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
            <p className="text-3xl font-bold text-red-600">{plan.percent}</p>
            <p className="text-gray-600 mb-4">{plan.desc}</p>
            <a
              href="/register"
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Invest Now
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
