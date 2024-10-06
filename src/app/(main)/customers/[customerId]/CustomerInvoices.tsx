'use client';

import React, { useEffect, useState } from 'react';
import type { Customer } from '@prisma/client';
import { useSessionContext } from '../../SessionContextProvider';
import kyInstance from '@/lib/ky';
import LoadingButton from '@/components/LoadingButton';
import InvoiceDownlaodButton from '../../invoices/InvoiceDownlaodButton';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: {
    customerId: string;
  };
}

interface Invoice {
  id: string;
  productCount: number;
  totalAmountPaid: number;
  dueAmount: number;
  createdAt: string;
}

const CustomerInvoice = ({ params: { customerId } }: PageProps) => {
  const { userData } = useSessionContext();


  //
  if (!userData)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">You&apos;re not authorized to view this page.</p>
      </div>
    );

  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null); 

  
  useEffect(() => {
    const fetchCustomerInvoices = async () => {
      try {
        const res = await kyInstance
          .get(`/api/customers/${customerId}`)
          .json<{ customer: Customer; invoices: Invoice[] }>();
        setCustomer(res.customer);
        setInvoices(res.invoices);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch invoices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerInvoices();
  }, [customerId]);

  
  const handleDownloadInvoice = async (invoiceId: string) => {
    setIsDownloading(invoiceId);
    try {
      const response = await kyInstance.get(`/api/generateInvoice/${invoiceId}`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const generateInvoice = await response.arrayBuffer();
      const blob = new Blob([generateInvoice], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setError('There was an error downloading the invoice');
    } finally {
      setIsDownloading(null);
    }
  };

  
  if (isLoading) {
    return (
      <div className="flex justify-center h-screen">
        <Loader2  className="animate-spin" />
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
     <div className="mx-auto w-full p-4">
        {customer && (
           <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h1 className="mb-2 text-3xl font-bold">{customer.name}</h1>
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                 <div className="mb-2 sm:mb-0">
                    <p className="text-gray-700">
                       <span className="font-medium">Phone:</span>{' '}
                       {customer.mobileNumber}
                    </p>
                 </div>
                 <div>
                    <p className="text-gray-700">
                       <span className="font-medium">Address:</span>{' '}
                       {customer.address}
                    </p>
                 </div>
              </div>
           </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-md">
           <h2 className="mb-4 text-2xl font-semibold">Invoices</h2>
           {invoices.length > 0 ? (
              <div className="space-y-4">
                 {invoices.map((invoice) => (
                    <div
                       key={invoice.id}
                       className="flex w-full flex-col items-start justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center"
                    >
                       <div className="space-y-1">
                          <p className="mb-3 text-xl font-extrabold text-gray-800">
                             {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700">
                             <span className="font-semibold text-gray-800">
                                Product Count:
                             </span>{' '}
                             {invoice.productCount}
                          </p>
                          <p className="text-sm text-gray-700">
                             <span className="font-semibold text-gray-800">
                                Total Paid:
                             </span>{' '}
                             ₹{invoice.totalAmountPaid.toFixed(2)}
                          </p>
                          <p className="text-sm text-red-800">
                             <span className="font-semibold">Due Amount:</span>{' '}
                             ₹{invoice.dueAmount.toFixed(2)}
                          </p>
                       </div>

                       <div className="mt-4 sm:mt-0">
                          <InvoiceDownlaodButton invoiceId={invoice.id} />
                       </div>
                    </div>
                 ))}
              </div>
           ) : (
              <p className="text-gray-600">
                 No invoices found for this customer.
              </p>
           )}
        </div>
     </div>
  );
};

export default CustomerInvoice;
