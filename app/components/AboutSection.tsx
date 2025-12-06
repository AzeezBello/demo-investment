import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
        <div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            What is Demo-Investment
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Demo-Investment is a trusted investment platform connecting traders
            with high-return opportunities in crypto, forex, and other digital
            markets. Our mission is to empower investors through secure
            strategies, real-time analytics, and expert insights.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We focus on transparency, automation, and long-term growth. Whether
            you’re an experienced investor or a beginner, we provide tailored
            solutions for every financial goal.
          </p>
          <a
            href="/about"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold"
          >
            Learn More
          </a>
        </div>

        <div className="relative h-72 md:h-96 rounded-md overflow-hidden">
          <Image
            src="/crypto-coin.jpg"
            alt="About VantageProfit"
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </section>
  );
}
