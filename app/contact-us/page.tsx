'use client';

import { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent by ${form.name}`);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="text-gray-800">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold uppercase tracking-wide">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div>
          <h2 className="text-3xl font-bold text-red-700 mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Have a question or want to know more about our services? Fill out the
            form below and our support team will reach out to you as soon as
            possible.
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white rounded-xl shadow-md p-8"
          >
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
                placeholder="Your full name"
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
                placeholder="Your email address"
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
                placeholder="Write your message..."
                className="w-full border border-gray-300 p-3 rounded-md h-32 resize-none focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 text-white py-3 rounded-md font-semibold hover:bg-red-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right: Contact Details */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-red-700 mb-6">
            Contact Information
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our support team is available 24/7 to assist with inquiries about
            trading, investments, and account management. Reach us directly
            through any of the channels below.
          </p>

          <ul className="space-y-4 text-gray-700">
            <li>
              <strong className="text-red-700">Email:</strong>{" "}
              support@demo-investment.com
            </li>
            <li>
              <strong className="text-red-700">Phone:</strong>{" "}
              +64 210 910 9406
            </li>
            <li>
              <strong className="text-red-700">Address:</strong> 25 Te Hoe Grove,
              Pinehill, Auckland 0632, New Zealand
            </li>
          </ul>

          <div className="mt-10">
          </div>
        </div>
      </section>

      {/* Map or Footer Banner */}
      <section className="bg-gray-50 py-20 text-center">
        <h3 className="text-2xl font-semibold text-red-700 mb-4">
          Global Support Network
        </h3>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          We’re trusted by clients across multiple continents. Wherever you are,
          our financial and technical experts are ready to assist.
        </p>
        <Image
          src="/team.jpg"
          alt="Global Support"
          width={800}
          height={400}
          className="mx-auto rounded-lg shadow-md object-cover"
        />
      </section>
      <Footer />
    </main>
  );
}
