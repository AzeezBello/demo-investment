import Section from "../components/Section";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Section title="Privacy Policy">
        <div className="max-w-4xl mx-auto space-y-8 leading-relaxed">
          <p className="text-gray-700">
            Your privacy is important to us at{" "}
            <span className="font-semibold text-red-700">Demo-Investment</span>.  
            This Privacy Policy explains how we collect, use, and protect your information 
            when you use our services.
          </p>

          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">1. Information We Collect</h2>
            <p>
              We collect personal data such as your name, email address, wallet information, 
              and transaction history to enable account registration and investment operations.
              Non-personal data such as browser type and device information may also be collected 
              to improve user experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To verify your account and identity</li>
              <li>To process deposits, withdrawals, and investment operations</li>
              <li>To provide support and improve platform functionality</li>
              <li>To send notifications or updates regarding your account</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">3. Data Protection</h2>
            <p>
              We use advanced encryption, secure servers, and compliance-grade data handling 
              to safeguard your personal and financial information against unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">4. Sharing of Information</h2>
            <p>
              We do not sell or rent user data. Information may be shared with trusted third-party 
              service providers strictly for operational purposes (e.g., payment processing, compliance).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">5. Cookies</h2>
            <p>
              Our website uses cookies to enhance usability and remember your preferences. 
              You may disable cookies in your browser settings, but some features may not function properly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">6. Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal data by contacting us at{" "}
              <Link href="/contact-us" className="text-red-700 hover:underline">
                support@demo-investment.com
              </Link>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">7. Updates to This Policy</h2>
            <p>
              This Privacy Policy may be updated periodically. Any changes will be posted on this page, 
              and continued use of the site implies acceptance of the new terms.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
            <p>
              Last updated: <span className="font-medium text-gray-800">October 30, 2025</span>
            </p>
            <p className="mt-1">
              Thank you for trusting <span className="text-red-700 font-medium">Demo-Investment</span> 
              with your financial journey.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
