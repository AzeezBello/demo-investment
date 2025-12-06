export default function AffiliateSection() {
  return (
    <section className="relative bg-black text-white text-center py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4 text-red-600">
          Affiliate Program
        </h2>
        <p className="text-gray-300 mb-6">
          Earn extra income by sharing VantageProfit.co with your network.
          Join our affiliate program today and start earning commissions for
          every referred investor.
        </p>
        <a
          href="/register"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold"
        >
          Join Now
        </a>
      </div>
    </section>
  );
}
