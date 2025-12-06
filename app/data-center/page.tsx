import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DataCenterPage() {
  return (
    <main className="text-gray-800">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold uppercase tracking-wide">Data Center</h1>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left image */}
        <div>
          <Image
            src="/datacenter.jpg"
            alt="Server Room"
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Right text */}
        <div>
          <h2 className="text-3xl font-bold text-red-700 mb-6">World-Class Infrastructure</h2>
          <p className="mb-4 leading-relaxed">
            Demo-Investment operates a globally distributed network of high-performance data centers designed for mining, blockchain processing, and cloud computing services.
          </p>
          <p className="mb-4 leading-relaxed">
            Our facilities are equipped with cutting-edge hardware, advanced cooling systems, and Tier IV power redundancy — ensuring maximum uptime and security for our partners and investors.
          </p>
          <p className="mb-4 leading-relaxed">
            Each facility follows strict international standards to ensure optimized energy efficiency and secure digital asset operations worldwide.
          </p>
        </div>
      </section>

      {/* Our Facilities Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-red-700 text-center mb-12">Our Facilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: "/datacenter-hall.jpg", title: "Advanced Cooling", desc: "Intelligent airflow management ensures optimal equipment temperature and long-term stability." },
              { img: "/server-control.jpg", title: "24/7 Monitoring", desc: "Dedicated operation teams monitor and maintain performance round-the-clock." },
              { img: "/datacenter-power.jpg", title: "Power Redundancy", desc: "Tier IV standard dual power supplies minimize downtime and protect all systems." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={400}
                  height={260}
                  className="w-full object-cover h-56"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-red-700 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Advantages Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-red-700 text-center mb-10">Core Advantages</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>Strategically located data centers across multiple continents.</li>
            <li>Top-tier security and encrypted communication channels.</li>
            <li>Dynamic cloud scalability to meet institutional demand.</li>
            <li>Low latency connections and optimized routing architecture.</li>
          </ul>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>Environmental sustainability through renewable energy usage.</li>
            <li>Comprehensive real-time performance analytics.</li>
            <li>Expert maintenance teams with 24/7 support availability.</li>
            <li>AI-powered optimization for power and cooling efficiency.</li>
          </ul>
        </div>
      </section>

      {/* Global Coverage Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
          {/* Left text */}
          <div>
            <h2 className="text-3xl font-bold text-red-700 mb-6">Global Coverage</h2>
            <p className="leading-relaxed mb-4">
              Our data centers are strategically located in regions with strong regulatory frameworks
              and advanced network infrastructure, ensuring stability and speed for our clients around the world.
            </p>
            <p className="leading-relaxed mb-4">
              From Asia-Pacific to Europe and North America, Demo-Investment provides secure,
              compliant, and efficient services for institutional and retail clients alike.
            </p>
            <p className="leading-relaxed">
              By continuously upgrading our global presence, we ensure optimized digital asset
              operations and cloud service delivery at all times.
            </p>
          </div>

          {/* Right image */}
          <div>
            <Image
              src="/global-map.png"
              alt="Global Data Center Locations"
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
