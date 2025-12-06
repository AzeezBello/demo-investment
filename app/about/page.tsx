import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="text-gray-800">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold uppercase tracking-wide">About Us</h1>
        </div>
      </section>

      {/* About Content Section */}
      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-start">
        {/* Left column - images */}
        <div className="space-y-6">
          <Image
            src="/datacenter.jpg"
            alt="Data Center"
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover"
          />
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/wisteriacert.png"
              alt="Certificate"
              width={300}
              height={400}
              className="rounded-lg shadow-md object-cover"
            />
          </div>
        </div>

        {/* Right column - text */}
        <div>
          <h2 className="text-3xl font-bold text-red-700 mb-6">About Us</h2>
          <p className="mb-4 leading-relaxed">
            Demo-Investment is determined to provide the one-stop financial and mining
            investment service for clients and investors around the world. As a trusted digital
            enterprise, we’re committed to becoming a cornerstone of trust in the digital economy.
          </p>
          <p className="mb-4 leading-relaxed">
            We specialize in blockchain technology services, providing top-tier cloud infrastructure
            solutions, software management systems, and secure investment products globally.
          </p>
          <p className="mb-4 leading-relaxed">
            Our ecosystem integrates blockchain, cloud computing, and financial management solutions
            — building a sustainable and transparent digital investment environment.
          </p>
          <p className="mb-4 leading-relaxed">
            Our team of blockchain and fintech experts includes professionals with years of experience
            across the global digital economy. Together, we help our clients achieve secure and
            profitable investments with confidence.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
          {/* Left text */}
          <div>
            <h2 className="text-3xl font-bold text-red-700 mb-6">Our Vision</h2>
            <p className="leading-relaxed mb-4">
              To make the world a better place through decentralization. Demo-Investment
              continues to expand the technological boundaries of blockchain, creating a foundation
              of trust and efficiency in the global economy.
            </p>
            <p className="leading-relaxed mb-4">
              We aim to accelerate blockchain innovation and empower users through secure,
              multi-dimensional financial ecosystems that drive growth and transparency.
            </p>
            <p className="leading-relaxed">
              Our mission is to embrace the digital economy by constantly improving our technology
              layout, enhancing innovation, and delivering all-round blockchain-integrated services.
            </p>
          </div>

          {/* Right image */}
          <div>
            <Image
              src="/team.jpg"
              alt="Our Team Vision"
              width={600}
              height={400}
              className="rounded-lg shadow-md object-cover"
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
