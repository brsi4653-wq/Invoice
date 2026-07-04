import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Download, Edit3, Trash2, Plus, FileCheck, Check, RotateCcw, Upload, Sparkles, X, Heart } from 'lucide-react';
import { InvoiceData, TemplateType, InvoiceItem } from '../types';
import { generateInvoicePdf } from '../utils/pdfGenerator';

interface InvoicePreviewProps {
  initialInvoice: InvoiceData;
  onReset: () => void;
}

export default function InvoicePreview({
  initialInvoice,
  onReset,
}: InvoicePreviewProps) {
  const [invoice, setInvoice] = useState<InvoiceData>(initialInvoice);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('swiss');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDonationPopup, setShowDonationPopup] = useState<boolean>(false);
  
  // Per-row discount and tax toggle states so we can show/hide the fields beautifully
  const [activeItemConfig, setActiveItemConfig] = useState<{ [itemId: string]: { showDiscount: boolean; showTax: boolean } }>({});

  // Accent Colors dictionary
  const ACCENT_COLORS = [
    { name: 'Classic Slate', hex: '#111827', bg: 'bg-[#111827]' },
    { name: 'Cobalt Blue', hex: '#2563EB', bg: 'bg-[#2563EB]' },
    { name: 'Emerald', hex: '#10B981', bg: 'bg-[#10B981]' },
    { name: 'Amber', hex: '#F59E0B', bg: 'bg-[#F59E0B]' },
    { name: 'Crimson', hex: '#EF4444', bg: 'bg-[#EF4444]' },
  ];

  const updateField = (field: keyof InvoiceData, value: any) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('logoBase64', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // Dynamic calculations for row totals
        const qty = field === 'quantity' ? Math.max(0, parseInt(value) || 0) : item.quantity;
        const price = field === 'price' ? Math.max(0, parseFloat(value) || 0) : item.price;
        const discPct = field === 'discount' ? Math.max(0, Math.min(100, parseFloat(value) || 0)) : (item.discount || 0);

        const base = qty * price;
        const discAmount = base * (discPct / 100);
        
        updatedItem.quantity = qty;
        updatedItem.price = price;
        updatedItem.discount = discPct;
        updatedItem.taxRate = 0;
        updatedItem.total = base - discAmount;
        
        return updatedItem;
      }
      return item;
    });

    setInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const deleteItem = (itemId: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'Creative Services / Design Consultancy',
      quantity: 1,
      price: 120.00,
      total: 120.00,
      discount: 0,
      taxRate: 0,
    };
    
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    // Initialize config states for new item row
    setActiveItemConfig((prev) => ({
      ...prev,
      [newItem.id]: { showDiscount: false, showTax: false },
    }));
  };

  const toggleItemRowField = (itemId: string, fieldType: 'discount' | 'tax') => {
    setActiveItemConfig((prev) => {
      const current = prev[itemId] || { showDiscount: false, showTax: false };
      return {
        ...prev,
        [itemId]: {
          ...current,
          showDiscount: fieldType === 'discount' ? !current.showDiscount : current.showDiscount,
          showTax: fieldType === 'tax' ? !current.showTax : current.showTax,
        },
      };
    });
  };

  // Re-calculate math reactively
  const subtotal = invoice.items.reduce((sum, item) => {
    const base = item.quantity * item.price;
    const itemDisc = item.discount ? base * (item.discount / 100) : 0;
    return sum + (base - itemDisc);
  }, 0);

  const discountAmount = subtotal * (invoice.discount / 100);
  const taxAmount = (subtotal - discountAmount) * (invoice.taxRate / 100);
  const grandTotal = subtotal - discountAmount + taxAmount + (invoice.shipping || 0);

  const handleDownload = async () => {
    try {
      // Programmatically update document.title to reflect exact custom string format
      const clientNameText = (invoice.clientName || '').trim() || 'Client Name';
      const invoiceNumberText = (invoice.invoiceNumber || '').trim() || 'Invoice Number';
      const docTitle = `${clientNameText} • ${invoiceNumberText}`;
      document.title = docTitle;

      await generateInvoicePdf(invoice, selectedTemplate);
      
      setSuccessMessage(`Exported PDF for Invoice ${invoice.invoiceNumber || 'Draft'}`);
      setTimeout(() => setSuccessMessage(null), 4000);

      // Trigger Goodwill donation popup ONCE per browser session
      const hasShown = sessionStorage.getItem('need_an_invoice_donation_shown') === 'true';
      if (!hasShown) {
        sessionStorage.setItem('need_an_invoice_donation_shown', 'true');
        // Slight delay for premium aesthetic feel
        setTimeout(() => {
          setShowDonationPopup(true);
        }, 800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentThemeHex = invoice.colorAccent || '#111827';

  return (
    <div className="space-y-6 animate-fadeIn text-[#E5E5E5] relative">
      
      {/* Top Bar Controls */}
      <div className="bg-[#141414] border border-[#222] rounded-3xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title Indicator */}
        <div className="flex items-center w-full md:w-auto px-1">
          <h3 className="text-sm font-bold text-white truncate">
            {(invoice.clientName || '').trim() || 'Client Name'} • {(invoice.invoiceNumber || '').trim() || 'Invoice Number'}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Template Selector */}
          <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#222] p-1 rounded-xl">
            {(['swiss', 'editorial', 'mono'] as TemplateType[]).map((temp) => (
              <button
                key={temp}
                onClick={() => setSelectedTemplate(temp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedTemplate === temp
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {temp}
              </button>
            ))}
          </div>

          {/* Download button */}
          <button
            id="download_pdf_btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-black font-extrabold uppercase tracking-wider rounded-xl text-xs hover:bg-neutral-200 transition cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-[#112411] border border-[#225522] rounded-2xl p-4 text-xs text-[#AAFFAA] flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 gap-6 items-start">
        
        {/* Single Invoice Creator Container */}
        <div className="space-y-6">
          
          <div className="bg-[#0D0D0D] border border-[#222] rounded-3xl shadow-lg p-8 md:p-12 space-y-8 max-w-4xl mx-auto relative overflow-hidden">
            
            {/* Ambient Accent Indicator based on selected color */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300"
              style={{ backgroundColor: currentThemeHex }}
            />

            {/* Custom Branding Options Bar */}
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left Side: Logo Upload */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase block">
                  Custom Brand Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative group w-16 h-16 bg-[#0D0D0D] border border-[#333] rounded-xl flex items-center justify-center overflow-hidden">
                    {invoice.logoBase64 ? (
                      <img 
                        src={invoice.logoBase64} 
                        alt="Logo" 
                        referrerPolicy="no-referrer"
                        className="object-contain max-w-full max-h-full p-1" 
                      />
                    ) : (
                      <Upload className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition duration-150 rounded-xl">
                      <label className="cursor-pointer flex flex-col items-center justify-center">
                        <Upload className="w-3.5 h-3.5 text-white animate-pulse" />
                        <span className="text-[7px] font-mono text-white mt-0.5 font-bold">
                          {invoice.logoBase64 ? 'REPLACE' : 'UPLOAD'}
                        </span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                      {invoice.logoBase64 && (
                        <button 
                          onClick={() => updateField('logoBase64', undefined)}
                          className="flex flex-col items-center justify-center cursor-pointer"
                          title="Remove Custom Logo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-[7px] font-mono text-red-500 mt-0.5 font-bold">DELETE</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white">Upload Brand Asset</p>
                    <p className="text-[10px] text-neutral-500 font-mono font-bold uppercase">PNG or JPEG format. Overrides default brand identity.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Header Fields: Vendor vs Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#222] pb-8">
              
              {/* ISSUED BY (VENDOR INFO) */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  Vendor Details (Issued By)
                </p>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={invoice.senderName}
                    onChange={(e) => updateField('senderName', e.target.value)}
                    placeholder="Your Name / Studio Name"
                    className="w-full text-sm font-bold text-white bg-transparent border-b border-[#222] focus:border-white pb-1 outline-none transition"
                  />
                  
                  <textarea
                    value={invoice.senderAddress}
                    onChange={(e) => updateField('senderAddress', e.target.value)}
                    placeholder="Studio Mailing Address"
                    rows={2}
                    className="w-full text-xs text-neutral-400 bg-transparent border-b border-[#222] focus:border-white outline-none resize-none leading-normal transition"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      value={invoice.senderEmail}
                      onChange={(e) => updateField('senderEmail', e.target.value)}
                      placeholder="business@email.com"
                      className="w-full text-xs text-neutral-400 bg-transparent border-b border-[#222] focus:border-white outline-none pb-1 transition"
                    />
                    <input
                      type="text"
                      value={invoice.senderPhone || ''}
                      onChange={(e) => updateField('senderPhone', e.target.value)}
                      placeholder="Phone (Optional)"
                      className="w-full text-xs text-neutral-400 bg-transparent border-b border-[#222] focus:border-white outline-none pb-1 transition"
                    />
                  </div>

                  <input
                    type="text"
                    value={invoice.senderTaxId || ''}
                    onChange={(e) => updateField('senderTaxId', e.target.value)}
                    placeholder="Tax ID / HST / GST Number"
                    className="w-full text-xs text-neutral-400 bg-transparent border-b border-[#222] focus:border-white outline-none pb-1 transition font-mono"
                  />
                </div>
              </div>

              {/* PREPARED FOR (CLIENT INFO) */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  Client Details (Prepared For)
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={invoice.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
                    placeholder="Client Name / Company Name"
                    className="w-full text-sm font-bold text-white bg-transparent border-b border-[#222] focus:border-white pb-1 outline-none transition"
                  />

                  <textarea
                    value={invoice.clientAddress}
                    onChange={(e) => updateField('clientAddress', e.target.value)}
                    placeholder="Client Billing Address"
                    rows={2}
                    className="w-full text-xs text-neutral-400 bg-transparent border-b border-[#222] focus:border-white outline-none resize-none leading-normal transition"
                  />

                  <textarea
                    value={invoice.clientShippingAddress || ''}
                    onChange={(e) => updateField('clientShippingAddress', e.target.value)}
                    placeholder="Client Shipping Address (if different)"
                    rows={2}
                    className="w-full text-xs text-neutral-400 bg-transparent border-b border-[#222] focus:border-white outline-none resize-none leading-normal transition"
                  />

                  <input
                    type="email"
                    value={invoice.clientEmail}
                    onChange={(e) => updateField('clientEmail', e.target.value)}
                    placeholder="client@company.com"
                    className="w-full text-xs text-neutral-400 bg-transparent border-b border-[#222] focus:border-white outline-none pb-1 transition"
                  />
                </div>
              </div>
            </div>

            {/* Metadata Fields Section */}
            <div className="bg-[#141414]/40 border border-[#222] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  INVOICE NUMBER
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  placeholder="INV-101"
                  className="w-full text-xs bg-[#0D0D0D] border border-[#222] focus:border-white px-3 py-2 rounded-lg text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  ISSUE DATE
                </label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full text-xs bg-[#0D0D0D] border border-[#222] focus:border-white px-3 py-2 rounded-lg text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  DUE DATE
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="w-full text-xs bg-[#0D0D0D] border border-[#222] focus:border-white px-3 py-2 rounded-lg text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  PO NUMBER
                </label>
                <input
                  type="text"
                  value={invoice.poNumber || ''}
                  onChange={(e) => updateField('poNumber', e.target.value)}
                  placeholder="PO-9902"
                  className="w-full text-xs bg-[#0D0D0D] border border-[#222] focus:border-white px-3 py-2 rounded-lg text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  PAYMENT TERMS
                </label>
                <select
                  value={invoice.paymentTerms || ''}
                  onChange={(e) => updateField('paymentTerms', e.target.value)}
                  className="w-full text-xs bg-[#0D0D0D] border border-[#222] focus:border-white px-3 py-2 rounded-lg text-white font-mono outline-none cursor-pointer"
                >
                  <option value="">Choose Terms...</option>
                  <option value="Net 14">Net 14 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Custom">Custom Terms</option>
                </select>
              </div>

            </div>

            {/* Dynamic Itemized Line Rows */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold font-mono tracking-wider text-neutral-500 uppercase">
                  Itemized Line details
                </h4>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#222] px-3.5 py-2 rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add line item
                </button>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-[#222] text-[11px] font-mono tracking-wider text-neutral-500 font-bold">
                <div className="col-span-6">DESCRIPTION</div>
                <div className="col-span-1 text-right">QTY</div>
                <div className="col-span-2 text-right">UNIT PRICE</div>
                <div className="col-span-1 text-center">MODIFIERS</div>
                <div className="col-span-2 text-right">ROW TOTAL</div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {invoice.items.length === 0 ? (
                  <div className="text-center py-8 text-xs text-neutral-500 bg-[#141414] border border-[#222] rounded-2xl">
                    No line items. Add at least one to calculate totals.
                  </div>
                ) : (
                  invoice.items.map((item) => {
                    const rowConfigs = activeItemConfig[item.id] || { showDiscount: false, showTax: false };
                    
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center p-4 md:p-0 border border-[#222] md:border-transparent rounded-2xl md:rounded-none bg-[#141414]/30 md:bg-transparent relative group"
                      >
                        {/* Description field */}
                        <div className="col-span-6 w-full">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="Creative Services / Design Consultancy"
                            className="w-full text-xs text-neutral-200 bg-transparent font-medium border-b border-[#222] hover:border-white focus:border-white outline-none pb-1 transition"
                          />
                        </div>

                        {/* Qty, Price, Modifiers, Row Total, Actions */}
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center w-full md:col-span-6 md:contents">
                          
                          {/* Quantity */}
                          <div className="md:col-span-1 md:text-right flex items-center md:justify-end gap-1.5">
                            <span className="md:hidden text-[10px] font-mono text-neutral-500">Qty:</span>
                            <input
                              type="number"
                              value={item.quantity === 0 ? '' : item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-12 text-xs text-white bg-transparent md:text-right border-b border-[#222] hover:border-white focus:border-white outline-none pb-1 transition font-mono"
                            />
                          </div>

                          {/* Unit Price */}
                          <div className="md:col-span-2 md:text-right flex items-center md:justify-end gap-1.5">
                            <span className="md:hidden text-[10px] font-mono text-neutral-500">Price:</span>
                            <input
                              type="number"
                              value={item.price === 0 ? '' : item.price}
                              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="w-20 text-xs text-white bg-transparent md:text-right border-b border-[#222] hover:border-white focus:border-white outline-none pb-1 transition font-mono"
                            />
                          </div>

                          {/* Toggleable Modifiers */}
                          <div className="md:col-span-1 text-center flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => toggleItemRowField(item.id, 'discount')}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border transition ${
                                (item.discount && item.discount > 0) || rowConfigs.showDiscount
                                  ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                                  : 'bg-[#1C1C1C] border-[#222] text-neutral-400 hover:text-white'
                              }`}
                              title="Toggle Item-level Discount"
                            >
                              % Disc
                            </button>
                          </div>

                          {/* Row Total & Delete action */}
                          <div className="md:col-span-2 text-right flex items-center justify-end gap-2 text-xs font-mono font-bold text-white min-w-[100px]">
                            <div className="flex flex-col text-right">
                              <span>${item.total.toFixed(2)}</span>
                              {item.discount ? (
                                <span className="text-[9px] text-amber-400 font-normal">-{item.discount}%</span>
                              ) : null}
                            </div>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-1 hover:bg-[#222] hover:text-red-400 rounded text-neutral-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title="Remove Line"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                        {/* Modifiers sub-inputs below row */}
                        {(rowConfigs.showDiscount || (item.discount && item.discount > 0)) && (
                          <div className="col-span-12 w-full flex items-center gap-4 bg-[#141414]/40 border border-[#222] rounded-xl px-4 py-2 mt-1">
                            <span className="text-[9px] font-mono font-bold text-neutral-400">LINE MODIFIERS:</span>
                            
                            {((item.discount && item.discount > 0) || rowConfigs.showDiscount) && (
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-[10px] font-mono text-amber-400 font-bold">Discount:</span>
                                <input
                                  type="number"
                                  value={item.discount || ''}
                                  onChange={(e) => handleItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                  className="w-12 bg-[#0D0D0D] border border-[#222] rounded px-1.5 py-0.5 text-white text-right font-mono"
                                />
                                <span className="text-[10px] text-neutral-500">%</span>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Section: Notes & Summary Block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-[#222]">
              
              {/* Left Column: Rich Text Notes Area */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono tracking-wider text-neutral-500 uppercase block">
                    Notes / Payment Directions
                  </label>
                  <textarea
                    value={invoice.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    rows={3}
                    placeholder="Provide banking info, wire transfer directions, or custom message."
                    className="w-full text-xs text-neutral-300 bg-[#141414] border border-[#222] focus:border-white p-3 rounded-xl outline-none resize-none leading-normal transition font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono tracking-wider text-neutral-500 uppercase block">
                    Terms & Agreements
                  </label>
                  <textarea
                    value={invoice.paymentTerms}
                    onChange={(e) => updateField('paymentTerms', e.target.value)}
                    rows={2}
                    placeholder="e.g. All work is transferrable upon complete receipt of funds. Standard Net 30 conditions apply."
                    className="w-full text-xs text-neutral-300 bg-[#141414] border border-[#222] focus:border-white p-3 rounded-xl outline-none resize-none leading-normal transition font-mono"
                  />
                </div>
              </div>

              {/* Right Column: Advanced Summary Block with Live Calculation */}
              <div className="md:col-span-5 space-y-3.5 text-xs text-neutral-400 md:pl-6">
                
                <div className="flex justify-between items-center font-mono">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>

                {/* Global Discount Input */}
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Global Discount (%):</span>
                  <input
                    type="number"
                    value={invoice.discount === 0 ? '' : invoice.discount}
                    onChange={(e) => updateField('discount', Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0"
                    className="w-12 text-right bg-transparent border-b border-[#222] hover:border-white focus:border-white outline-none font-semibold text-white"
                  />
                </div>

                {/* Global Tax Input */}
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Global Tax (%):</span>
                  <input
                    type="number"
                    value={invoice.taxRate === 0 ? '' : invoice.taxRate}
                    onChange={(e) => updateField('taxRate', Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0"
                    className="w-12 text-right bg-transparent border-b border-[#222] hover:border-white focus:border-white outline-none font-semibold text-white"
                  />
                </div>

                {/* Shipping Fee */}
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Shipping Fee (CA$):</span>
                  <input
                    type="number"
                    value={invoice.shipping === 0 ? '' : invoice.shipping}
                    onChange={(e) => updateField('shipping', Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0.00"
                    className="w-16 text-right bg-transparent border-b border-[#222] hover:border-white focus:border-white outline-none font-semibold text-white"
                  />
                </div>

                <div className="h-px bg-[#222] mt-4 mb-4" />

                <div className="flex justify-between items-center text-sm font-bold text-white font-sans pt-1 pb-1">
                  <span>Total Due (CAD):</span>
                  <span className="text-base tracking-tight underline decoration-2 underline-offset-2 decoration-neutral-700">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Elegant Goodwill Donation Popup Modal */}
      {showDonationPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#141414] border border-[#222] max-w-md w-full rounded-2xl shadow-2xl p-6 relative space-y-4">
            
            <button 
              onClick={() => setShowDonationPopup(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-950/40 border border-red-900 rounded-xl text-red-400">
                <Heart className="w-5 h-5 fill-red-500" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                Support Free Software
              </h3>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              <strong>Need An Invoice By: SHIPS</strong> is completely free. This tool was built to help independent creators and artists generate professional documents without hidden subscriptions, fees, or tracking limits. If this saved you time today, please consider dropping a small tip to help us keep this server running and completely free for everyone!
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a 
                href="https://donate.stripe.com/bJe6oGeFZehq7yu73H9Ve07" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 bg-white text-black hover:bg-neutral-200 transition font-extrabold text-xs text-center rounded-xl uppercase tracking-wider block"
              >
                ☕ Support with a Tip
              </a>
              <button 
                onClick={() => setShowDonationPopup(false)}
                className="w-full py-2 bg-[#1C1C1C] border border-[#2A2A2A] text-neutral-400 hover:text-white transition text-xs text-center rounded-xl font-bold"
              >
                Maybe Later
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
