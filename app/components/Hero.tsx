import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="relative bg-black text-white h-[90vh] flex items-center justify-center"
      style={{
        backgroundImage: "url('/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative text-center max-w-3xl px-6">
        <h1 className="text-5xl font-bold mb-4 text">
          Best Practice From <span className="text-red-500">Financial Experts</span>
        </h1>
        <p className="mb-8 text-lg">
          Build your portfolio with experience and smart investment solutions.
        </p>
        <a
          href="/register"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
