import Image from "next/image";

export default function Partners() {
  const partners = [
    "/sgx.svg",
    "/upbit.svg",
    "/huobi.svg",
    "/euro.svg",
    "/capital.png",
    "/london.svg",
    "/krak.svg",
    "/nasdaq.svg",
  ];

  return (
    <section className="text-center bg-white py-16">
      <h2 className="text-2xl font-bold text-red-600 mb-8">Our Partners</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
        {partners.map((src, i) => (
          <div key={i} className="relative h-20 grayscale hover:grayscale-0">
            <Image src={src} alt={`Partner ${i}`} fill className="object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}
