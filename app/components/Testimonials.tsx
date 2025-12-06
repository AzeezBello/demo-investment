export default function Testimonials() {
  const testimonials = [
    {
      name: "Amir Lee",
      quote:
        "Excellent platform! I’ve seen consistent profits and great customer support.",
    },
    {
      name: "Anny Liu",
      quote: "Secure, transparent, and easy to use — highly recommended!",
    },
    {
      name: "Eric John",
      quote:
        "This is the best investment platform I’ve ever used. Professional team!",
    },
  ];

  return (
    <section className="bg-gray-50 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-8">
        What People Say About Us
      </h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-white p-6 rounded-md shadow hover:shadow-lg transition"
          >
            <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
            <p className="font-semibold text-red-600">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
