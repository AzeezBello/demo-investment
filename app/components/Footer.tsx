export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-sm text-center py-10 px-6">
      <p>
        © {new Date().getFullYear()} <span className="text-red-600">Demo-Investment</span> — All rights reserved.
      </p>
      <p className="mt-2 text-gray-500">
        Built for modern investors. Secure. Transparent. Profitable.
      </p>
    </footer>
  );
}
