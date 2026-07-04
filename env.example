import { jsPDF } from 'jspdf';
import { InvoiceData, TemplateType } from '../types';

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || 100, height: img.naturalHeight || 100 });
    };
    img.onerror = () => {
      resolve({ width: 100, height: 100 });
    };
    img.src = src;
  });
}

export async function generateInvoicePdf(invoice: InvoiceData, template: TemplateType): Promise<void> {
  // Create PDF doc in Portrait, Millimeters, A4 size (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = width - margin * 2; // 170mm

  // Colors & Fonts based on Template
  let primaryColor = '#111827'; // Dark gray/black
  let secondaryColor = '#4B5563'; // Medium gray
  let accentColor = '#9CA3AF'; // Light gray
  let borderStyle = 'solid';
  let fontName = 'helvetica'; // swiss by default

  if (template === 'editorial') {
    fontName = 'times';
    primaryColor = '#1C1917'; // warm stone dark
    secondaryColor = '#57534E';
    accentColor = '#A8A29E';
    borderStyle = 'double';
  } else if (template === 'mono') {
    fontName = 'courier';
    primaryColor = '#0F172A'; // deep slate
    secondaryColor = '#475569';
    accentColor = '#94A3B8';
    borderStyle = 'dotted';
  }

  // If a custom branding color accent is supplied, use it
  if (invoice.colorAccent && invoice.colorAccent !== 'classic') {
    primaryColor = invoice.colorAccent;
  }

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [
      isNaN(r) ? 17 : r,
      isNaN(g) ? 24 : g,
      isNaN(b) ? 39 : b
    ];
  };

  const pColor = hexToRgb(primaryColor);
  const sColor = hexToRgb(secondaryColor);
  const aColor = hexToRgb(accentColor);

  // Calculate aspect ratio and dimensions for the brand logo to prevent squashing/stretching
  let logoHeight = 0;
  let logoWidth = 0;
  const logoSrc = invoice.logoBase64 || '/falcon.png';

  if (logoSrc) {
    try {
      const dims = await getImageDimensions(logoSrc);
      const maxWidthMm = 45; // Max logo width is 45mm
      const aspectRatio = dims.height / dims.width;
      logoWidth = maxWidthMm;
      logoHeight = maxWidthMm * aspectRatio;
      // Cap max height to 25mm to avoid oversized logos
      if (logoHeight > 25) {
        logoHeight = 25;
        logoWidth = logoHeight / aspectRatio;
      }
    } catch (err) {
      console.error("Error computing logo dimensions:", err);
    }
  }

  // Draw custom branding logo in the top-left of the page if it exists
  if (logoSrc && logoHeight > 0) {
    try {
      doc.addImage(logoSrc, 'PNG', margin, margin, logoWidth, logoHeight);
    } catch (err) {
      console.error("Error drawing logo in PDF:", err);
    }
  }

  // Header Title on the top-right (opposite the brand logo)
  doc.setFont(fontName, 'bold');
  if (template === 'swiss') {
    doc.setFontSize(26);
    doc.setTextColor(pColor[0], pColor[1], pColor[2]);
    doc.text('INVOICE', width - margin, margin + 8, { align: 'right' });
  } else if (template === 'editorial') {
    doc.setFontSize(28);
    doc.setTextColor(pColor[0], pColor[1], pColor[2]);
    doc.text('Invoice', width - margin, margin + 10, { align: 'right' });
  } else {
    doc.setFontSize(22);
    doc.setTextColor(pColor[0], pColor[1], pColor[2]);
    doc.text('=== INVOICE ===', width - margin, margin + 6, { align: 'right' });
  }

  // Ensure surrounding header columns shift down cleanly based on logo height
  let y = Math.max(margin + logoHeight, margin + 15) + 12;

  // Draw dividing line helper
  const drawDivider = (currentY: number) => {
    doc.setDrawColor(aColor[0], aColor[1], aColor[2]);
    if (template === 'editorial') {
      doc.setLineWidth(0.4);
      doc.line(margin, currentY, width - margin, currentY);
      doc.line(margin, currentY + 0.8, width - margin, currentY + 0.8);
    } else if (template === 'mono') {
      doc.setLineWidth(0.2);
      // Draw dotted line manually
      let x = margin;
      while (x < width - margin) {
        doc.line(x, currentY, x + 1, currentY);
        x += 2;
      }
    } else {
      doc.setLineWidth(0.6);
      doc.line(margin, currentY, width - margin, currentY);
    }
  };

  // Header Metadata Grid
  doc.setFont(fontName, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(sColor[0], sColor[1], sColor[2]);

  // Invoice detail rows
  const detailCol1X = margin;
  const detailCol2X = margin + 68; // Increased column gap to guarantee no overlap
  const detailCol3X = width - margin - 48;

  // Billed From (Sender Vendor Info)
  doc.setFont(fontName, 'bold');
  doc.setTextColor(pColor[0], pColor[1], pColor[2]);
  doc.text('ISSUED BY', detailCol1X, y);
  doc.setFont(fontName, 'normal');
  doc.setTextColor(sColor[0], sColor[1], sColor[2]);
  
  const senderLines = [
    invoice.senderName,
    ...invoice.senderAddress.split('\n'),
    invoice.senderEmail,
    invoice.senderPhone ? `Phone: ${invoice.senderPhone}` : '',
    invoice.senderTaxId ? `Tax ID: ${invoice.senderTaxId}` : ''
  ].filter(Boolean);

  let senderY = y + 5;
  senderLines.forEach((line) => {
    const maxWidth = detailCol2X - detailCol1X - 5;
    const split = doc.splitTextToSize(line, maxWidth);
    doc.text(split, detailCol1X, senderY);
    senderY += split.length * 4.5;
  });

  // Billed To (Client Info)
  doc.setFont(fontName, 'bold');
  doc.setTextColor(pColor[0], pColor[1], pColor[2]);
  doc.text('PREPARED FOR', detailCol2X, y);
  doc.setFont(fontName, 'normal');
  doc.setTextColor(sColor[0], sColor[1], sColor[2]);

  const clientLines = [
    invoice.clientName,
    ...invoice.clientAddress.split('\n'),
    invoice.clientEmail,
    invoice.clientShippingAddress ? `Shipping: ${invoice.clientShippingAddress}` : ''
  ].filter(Boolean);

  let clientY = y + 5;
  clientLines.forEach((line) => {
    const maxWidth = detailCol3X - detailCol2X - 5;
    const split = doc.splitTextToSize(line, maxWidth);
    doc.text(split, detailCol2X, clientY);
    clientY += split.length * 4.5;
  });

  // Invoice Meta Details
  doc.setFont(fontName, 'bold');
  doc.setTextColor(pColor[0], pColor[1], pColor[2]);
  doc.text('INVOICE DETAILS', detailCol3X, y);
  doc.setFont(fontName, 'normal');
  doc.setTextColor(sColor[0], sColor[1], sColor[2]);

  let metaY = y + 5;
  doc.text(`Invoice No:  ${invoice.invoiceNumber || '—'}`, detailCol3X, metaY);
  metaY += 4.5;
  doc.text(`Issue Date:  ${invoice.date || '—'}`, detailCol3X, metaY);
  metaY += 4.5;
  doc.text(`Due Date:    ${invoice.dueDate || '—'}`, detailCol3X, metaY);
  
  if (invoice.poNumber) {
    metaY += 4.5;
    doc.text(`PO Number:   ${invoice.poNumber}`, detailCol3X, metaY);
  }
  if (invoice.paymentTerms) {
    metaY += 4.5;
    doc.text(`Terms:       ${invoice.paymentTerms}`, detailCol3X, metaY);
  }

  // Take the max height of columns
  const colMaxHeightY = Math.max(senderY, clientY, metaY);
  y = colMaxHeightY + 10;

  // Draw table header divider
  drawDivider(y);
  y += 5;

  // Table Columns Setup
  const colDescX = margin;
  const colQtyX = margin + 90;
  const colPriceX = margin + 115;
  const colTotalX = width - margin; // right aligned, so we use text-align right

  // Table Headers
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(pColor[0], pColor[1], pColor[2]);

  doc.text('Description', colDescX, y);
  doc.text('Qty', colQtyX, y, { align: 'right' });
  doc.text('Unit Price', colPriceX, y, { align: 'right' });
  doc.text('Total', colTotalX, y, { align: 'right' });

  y += 4;
  drawDivider(y);
  y += 6;

  // Items rows
  doc.setFont(fontName, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(sColor[0], sColor[1], sColor[2]);

  let subtotal = 0;

  invoice.items.forEach((item) => {
    // Check page overflow
    if (y > height - 60) {
      doc.addPage();
      y = margin;
      
      // Reprint table header
      doc.setFont(fontName, 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(pColor[0], pColor[1], pColor[2]);
      doc.text('Description', colDescX, y);
      doc.text('Qty', colQtyX, y, { align: 'right' });
      doc.text('Unit Price', colPriceX, y, { align: 'right' });
      doc.text('Total', colTotalX, y, { align: 'right' });
      
      y += 4;
      drawDivider(y);
      y += 6;
      doc.setFont(fontName, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(sColor[0], sColor[1], sColor[2]);
    }

    // Advanced Row-level Calculations
    const itemBase = item.quantity * item.price;
    const itemDiscount = item.discount ? itemBase * (item.discount / 100) : 0;
    const itemTotal = itemBase - itemDiscount;
    subtotal += itemTotal;

    // Build row description description text with details if any
    let rowDescText = item.description;
    if (item.discount) {
      rowDescText += `\n(Less ${item.discount}% Disc)`;
    }

    // Split text if description is long
    const itemDescLines = doc.splitTextToSize(rowDescText, 80);
    const lineCount = itemDescLines.length;

    // Draw lines
    doc.text(itemDescLines, colDescX, y);
    doc.text(item.quantity.toString(), colQtyX, y, { align: 'right' });
    doc.text(`$${item.price.toFixed(2)}`, colPriceX, y, { align: 'right' });
    doc.text(`$${itemTotal.toFixed(2)}`, colTotalX, y, { align: 'right' });

    y += lineCount * 5;
  });

  // Under-table divider
  y += 1;
  drawDivider(y);
  y += 6;

  // Global calculations based on itemized subtotal
  const discountAmount = subtotal * (invoice.discount / 100);
  const taxAmount = (subtotal - discountAmount) * (invoice.taxRate / 100);
  const grandTotal = subtotal - discountAmount + taxAmount + invoice.shipping;

  // Summary Details Page Overflow Check
  if (y > height - 85) {
    doc.addPage();
    y = margin;
  }

  // Draw Bottom Layout: Notes on Left, Summary on Right
  const summaryStartX = width - margin - 65;

  // Left Side: Notes & Terms
  doc.setFontSize(8.5);
  let leftY = y;
  if (invoice.notes) {
    doc.setFont(fontName, 'bold');
    doc.setTextColor(pColor[0], pColor[1], pColor[2]);
    doc.text('Notes / Payment Directions', margin, leftY);
    doc.setFont(fontName, 'normal');
    doc.setTextColor(sColor[0], sColor[1], sColor[2]);
    
    const notesLines = doc.splitTextToSize(invoice.notes, summaryStartX - margin - 10);
    doc.text(notesLines, margin, leftY + 4.5);
    leftY += 4.5 + (notesLines.length * 4.5);
  }

  if (invoice.paymentTerms) {
    leftY += 3;
    doc.setFont(fontName, 'bold');
    doc.setTextColor(pColor[0], pColor[1], pColor[2]);
    doc.text('Terms & Agreements', margin, leftY);
    doc.setFont(fontName, 'normal');
    doc.setTextColor(sColor[0], sColor[1], sColor[2]);

    const termsLines = doc.splitTextToSize(invoice.paymentTerms, summaryStartX - margin - 10);
    doc.text(termsLines, margin, leftY + 4.5);
  }

  // Right Side: Sum-up
  doc.setFontSize(9);
  doc.setFont(fontName, 'normal');
  doc.setTextColor(sColor[0], sColor[1], sColor[2]);

  let rightY = y;
  
  // Row: Subtotal
  doc.text('Subtotal:', summaryStartX, rightY);
  doc.text(`$${subtotal.toFixed(2)}`, colTotalX, rightY, { align: 'right' });
  rightY += 5;

  // Row: Discount (if any)
  if (invoice.discount > 0) {
    doc.text(`Discount (${invoice.discount}%):`, summaryStartX, rightY);
    doc.text(`-$${discountAmount.toFixed(2)}`, colTotalX, rightY, { align: 'right' });
    rightY += 5;
  }

  // Row: Tax (if any)
  if (invoice.taxRate > 0) {
    doc.text(`Tax (${invoice.taxRate}%):`, summaryStartX, rightY);
    doc.text(`+$${taxAmount.toFixed(2)}`, colTotalX, rightY, { align: 'right' });
    rightY += 5;
  }

  // Row: Shipping (if any)
  if (invoice.shipping > 0) {
    doc.text('Shipping & Handling:', summaryStartX, rightY);
    doc.text(`+$${invoice.shipping.toFixed(2)}`, colTotalX, rightY, { align: 'right' });
    rightY += 5;
  }

  // Total divider
  doc.setDrawColor(aColor[0], aColor[1], aColor[2]);
  doc.setLineWidth(0.3);
  doc.line(summaryStartX, rightY + 1.5, colTotalX, rightY + 1.5);
  rightY += 6.5;

  // Row: Grand Total
  doc.setFont(fontName, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(pColor[0], pColor[1], pColor[2]);
  doc.text('Total Due (CAD):', summaryStartX, rightY);
  doc.text(`$${grandTotal.toFixed(2)}`, colTotalX, rightY, { align: 'right' });

  // Add subtle footer
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(aColor[0], aColor[1], aColor[2]);
  doc.text('Generated with Need An Invoice By: SHIPS', margin, height - 12);

  // Save the generated document with a dynamic client & invoice number format
  const clientStr = (invoice.clientName || '').trim() || 'Client_Name';
  const numberStr = (invoice.invoiceNumber || '').trim() || 'Invoice_Number';
  const cleanFilename = `${clientStr}_${numberStr}`.replace(/[^a-z0-9_\-]/gi, '_');
  doc.save(`${cleanFilename}.pdf`);
}
