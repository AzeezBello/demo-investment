import Section from "@/components/Section";

const faqs = [
  {
    question: "What is Demo-Investment?",
    answer:
      "Demo-Investment is a global financial technology platform that empowers users to trade, invest, and grow their digital assets securely with transparency and innovation.",
  },
  {
    question: "How do I open an account?",
    answer:
      "Simply visit our registration page, fill out the required details, verify your email, and your account will be ready to fund and start trading.",
  },
  {
    question: "Is my investment safe?",
    answer:
      "Yes. We use bank-grade encryption, secure wallets, and strict compliance measures to ensure your funds and personal information remain protected.",
  },
  {
    question: "How do withdrawals work?",
    answer:
      "Withdrawals are processed to your verified crypto wallet or bank account, usually within 24–48 hours depending on the network and verification process.",
  },
  {
    question: "Can I contact support directly?",
    answer:
      "Absolutely. You can reach our 24/7 customer support via the contact page or email at support@demo-investment.com.",
  },
  {
    question: "Do you charge hidden fees?",
    answer:
      "No. All our transaction and management fees are clearly stated before confirmation. We believe in complete transparency.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Section title="Frequently Asked Questions">
        <div className="max-w-4xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-10 text-gray-700">
          <p>
            Still have questions?{" "}
            <a href="/contact-us" className="text-red-700 font-semibold hover:underline">
              Contact our support team
            </a>{" "}
            anytime.
          </p>
        </div>
      </Section>
    </main>
  );
}
