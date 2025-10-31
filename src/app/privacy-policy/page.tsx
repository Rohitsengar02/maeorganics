'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-neutral max-w-none text-sm leading-7">
        <p>
          We value your privacy. This Privacy Policy explains how Maeorganics collects, uses, and protects your personal data.
        </p>
        <h2>Information We Collect</h2>
        <ul>
          <li>Account information (name, email, phone)</li>
          <li>Order details (addresses, items, payment status)</li>
          <li>Device and usage data (cookies, analytics)</li>
        </ul>
        <h2>How We Use Information</h2>
        <ul>
          <li>To process and deliver your orders</li>
          <li>To improve our products and services</li>
          <li>To communicate promotions and updates (with consent)</li>
        </ul>
        <h2>Data Security</h2>
        <p>
          We implement industry-standard safeguards to protect your data. However, no method of transmission over the internet is 100% secure.
        </p>
        <h2>Contact</h2>
        <p>
          For questions about this policy, email care@maeorganics.com.
        </p>
      </div>
    </div>
  );
}
