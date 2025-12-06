'use client';
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // optional: add lucide-react for better icons

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md border-b border-red-600">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-red-600">Demo-Investment</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <nav
          className={`absolute md:static left-0 top-[72px] md:top-auto w-full md:w-auto bg-black md:bg-transparent transition-all duration-300 ease-in-out ${
            open ? "opacity-100 visible" : "opacity-0 invisible md:visible md:opacity-100"
          }`}
        >
          <ul className="flex flex-col md:flex-row items-center md:space-x-8 py-4 md:py-0">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/data-center", label: "Data Center" },
              { href: "/contact-us", label: "Contact" },
              { href: "/login", label: "Login" },
            ].map((link) => (
              <li key={link.href} className="my-2 md:my-0">
                <Link
                  href={link.href}
                  className="text-gray-200 hover:text-red-500 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 md:mt-0">
              <Link
                href="/register"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
