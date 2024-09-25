'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { InvoicePrintData } from '@/lib/types';

interface InvoiceDialoagProps {
  invoice: InvoicePrintData | null;
  setInvoice: (invoice: InvoicePrintData | null) => void;
}

const InvoiceDialoag = ({ invoice, setInvoice }: InvoiceDialoagProps) => {
  const [html2pdfModule, setHtml2pdfModule] = useState<any>(null);

  // Dynamically import html2pdf only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('html2pdf.js').then((module) => {
        setHtml2pdfModule(module.default); // Accessing the default export
      });
    }
  }, []);

  const handleClick = () => {
    if (!html2pdfModule) return;

    const element = document.querySelector('#pdf');
    html2pdfModule().from(element).save(); // Use the html2pdf function
    setInvoice(null);
  };

  return (
    <div>
      <Button onClick={handleClick} className="w-full" disabled={invoice === null}>
        Download
      </Button>
      {invoice && (
        <div className="hidden">
          <div id="pdf" className="bg-white">
            {/* The rest of your PDF content goes here */}
            <div className="mx-auto h-[297mm] w-[210mm] border">
              {/* Invoice structure as you provided */}
              <div className="box-border border border-black">
                {/* Rest of your invoice HTML */}
                <div className="flex justify-between border-b border-black px-3 py-1">
                  <p className="font-bold">TAX INVOICE</p>
                  <p>{invoice.rate.date}</p>
                </div>
                <div className="flex justify-between border-b border-black p-2 pb-7 leading-6">
                  <div className="w-[30%] space-y-2">
                    <p className="font-bold">{invoice.user.companyName}</p>
                    <p className="text-sm">{invoice.user.address}</p>
                  </div>
                  <div className="w-[30%]">
                    <p className="font-bold">{invoice.user.companyName}</p>
                    <p>{invoice.customer.name}</p>
                    <p className="text-sm">
                      {invoice.customer.address}
                      <br />
                      <span className="font-bold">
                        Ph: {invoice.customer.mobileNumber}
                      </span>
                    </p>
                  </div>
                </div>
                {/* Add the rest of your invoice content here */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDialoag;
