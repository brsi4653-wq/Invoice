import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { InvoiceData } from './types';
import InvoicePreview from './components/InvoicePreview';

// Clean empty initial template invoice for pristine page load
const INITIAL_CREATOR_INVOICE: InvoiceData = {
  invoiceNumber: "",
  date: "",
  dueDate: "",
  senderName: "",
  senderAddress: "",
  senderEmail: "",
  senderPhone: "",
  senderTaxId: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  clientShippingAddress: "",
  poNumber: "",
  paymentTerms: "",
  logoBase64: undefined,
  colorAccent: "#111827", // classic slate default
  items: [],
  notes: "",
  taxRate: 0,
  discount: 0,
  shipping: 0
};

export default function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(INITIAL_CREATOR_INVOICE);

  const handleReset = () => {
    // Reset to an empty, fresh form template
    setInvoice({
      invoiceNumber: "",
      date: "",
      dueDate: "",
      senderName: "",
      senderAddress: "",
      senderEmail: "",
      senderPhone: "",
      senderTaxId: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      clientShippingAddress: "",
      poNumber: "",
      paymentTerms: "",
      logoBase64: undefined,
      colorAccent: "#111827",
      items: [],
      notes: "",
      taxRate: 0,
      discount: 0,
      shipping: 0
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex flex-col font-sans selection:bg-white selection:text-black relative">
      
      {/* Subtle Dark Theme Radial Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none h-96 z-0" />

      {/* Primary Header */}
      <header id="app_header" className="border-b border-[#1A1A1A] bg-[#050505]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              Need An Invoice By: <span className="font-extrabold italic text-neutral-300">SHIPS</span>
            </h1>
          </div>

          {/* Right Header Navigation - Support Button */}
          <div className="flex items-center space-x-4">
            <a
              href="https://donate.stripe.com/bJe6oGeFZehq7yu73H9Ve07"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#222] bg-[#141414] hover:bg-neutral-800 hover:border-neutral-700 text-xs font-bold font-sans rounded-full text-neutral-300 hover:text-white transition duration-150 cursor-pointer shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              ☕ Buy Us a Coffee
            </a>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 z-10 relative space-y-8">
        
        {/* Intro Hero Header */}
        <div className="space-y-2 text-center max-w-xl mx-auto pt-2 animate-fadeIn">
          <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl">
            Free Professional Invoice Studio
          </h2>
          <p className="text-xs text-[#888] leading-relaxed max-w-lg mx-auto font-sans">
            A minimalist utility designed for independent creators, artists, and contractors. 
            No subscriptions, zero tracking, and absolute privacy. Export clean Swiss Minimalist, Classic Editorial, or Tech Mono PDF invoices instantly.
          </p>
        </div>

        {/* Workspace Central Core */}
        <div className="w-full">
          <InvoicePreview
            initialInvoice={invoice}
            onReset={handleReset}
          />
        </div>

      </main>

    </div>
  );
}
