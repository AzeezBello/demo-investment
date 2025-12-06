import Image from "next/image";

export default function Services() {
  const services = [
    {
      title: "Cryptocurrency",
      desc: "Invest safely in Bitcoin and other leading digital currencies.",
      img: "/crypto.jpg",
    },
    {
      title: "Bitcoin Mining",
      desc: "Earn consistent returns with our modern mining infrastructure.",
      img: "/mining.jpg",
    },
    {
      title: "Forex",
      desc: "Trade global currencies with minimal risk and expert guidance.",
      img: "/forex.jpg",
    },
    {
      title: "Real Estate",
      desc: "Participate in tokenized property investments worldwide.",
      img: "/realestate.jpg",
    },
  ];

  return (
    <section className="text-center bg-white">
      <h2 className="text-3xl font-bold text-red-600 mb-10">Our Services</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 px-6">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-gray-50 rounded-md shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative h-40">
              <Image
                src={service.img}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-red-600 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-700 text-sm">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
