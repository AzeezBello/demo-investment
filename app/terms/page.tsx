import Section from "../components/Section";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Section title="Terms and Conditions">
        <div className="max-w-4xl mx-auto space-y-8 leading-relaxed">
          {/* Intro */}
          <p className="text-gray-700">
            Welcome to <span className="font-semibold text-red-700">Demo-Investment</span>.  
            By accessing or using our website, services, or platform, you agree to comply with 
            the following Terms and Conditions. Please read them carefully before registering or investing.
          </p>

          {/* 1. Eligibility */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">1. Eligibility</h2>
            <p>
              You must be at least 18 years of age to register or use our platform. By creating an 
              account, you confirm that you meet all legal requirements to engage in investment activities 
              in your jurisdiction.
            </p>
          </div>

          {/* 2. Account Responsibilities */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">2. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials. 
              Any activity performed through your account is your responsibility. Notify us immediately 
              if you suspect unauthorized access.
            </p>
          </div>

          {/* 3. Investment Policy */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">3. Investment Policy</h2>
            <p>
              All investments carry risks. Profit Bridge Capital provides trading and financial tools, 
              but does not guarantee profits or prevent losses. Users are encouraged to perform 
              independent research before committing funds.
            </p>
          </div>

          {/* 4. Payment and Withdrawals */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">4. Payments and Withdrawals</h2>
            <p>
              Deposits and withdrawals are processed through secure financial channels.  
              Users must provide accurate wallet or payment information. We reserve the right 
              to verify transactions for compliance and security purposes.
            </p>
          </div>

          {/* 5. Prohibited Activities */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">5. Prohibited Activities</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Using the platform for fraudulent or illegal purposes</li>
              <li>Sharing false information or impersonating others</li>
              <li>Attempting to hack, exploit, or misuse system vulnerabilities</li>
            </ul>
          </div>

          {/* 6. Termination */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">6. Termination of Account</h2>
            <p>
              Profit Bridge Capital reserves the right to suspend or terminate accounts that violate 
              our terms, engage in suspicious activity, or breach compliance standards.
            </p>
          </div>

          {/* 7. Limitation of Liability */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">7. Limitation of Liability</h2>
            <p>
              We are not liable for any direct or indirect losses resulting from trading, 
              technical errors, or third-party services. Your use of the platform is at your own risk.
            </p>
          </div>

          {/* 8. Modifications */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">8. Modifications to Terms</h2>
            <p>
              Profit Bridge Capital reserves the right to update or modify these Terms and Conditions 
              at any time. Updates will take effect immediately upon publication on this page.
            </p>
          </div>

          {/* 9. Contact */}
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">9. Contact Us</h2>
            <p>
              If you have any questions or concerns about these Terms and Conditions, please reach out to us at{" "}
              <Link href="/contact-us" className="text-red-700 hover:underline">
                contact@demo-investment.com
              </Link>.
            </p>
          </div>

          {/* Footer Note */}
          <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
            <p>
              Last updated: <span className="font-medium text-gray-800">October 30, 2025</span>
            </p>
            <p className="mt-1">
              By continuing to use this website, you agree to these terms in full.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
