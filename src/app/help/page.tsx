'use client';

export default function HelpPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Help Center</h1>
      <p className="text-sm text-muted-foreground mb-8">Find answers to common questions and get support.</p>

      <div className="prose prose-neutral max-w-none text-sm leading-7">
        <h2 id="orders">Orders</h2>
        <p>Track your order from your account under Orders. For any issues, contact care@maeorganics.com with your order ID.</p>

        <h2 id="shipping">Shipping</h2>
        <p>We ship across India. Typical delivery times are 2-7 business days depending on your location.</p>

        <h2 id="returns">Returns & Refunds</h2>
        <p>If you received a damaged or incorrect product, raise a return request within 7 days of delivery.</p>

        <h2 id="faq">FAQ</h2>
        <ul>
          <li>How do I cancel my order? — Contact support before the order is shipped.</li>
          <li>Do you offer COD? — Yes, COD is available in select locations.</li>
          <li>How do I change my address? — Update your address in your account before placing the order.</li>
        </ul>
      </div>
    </div>
  );
}
