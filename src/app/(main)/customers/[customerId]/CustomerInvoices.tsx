'use client';

import React, { useEffect, useState } from 'react';
import type { Customer } from '@prisma/client';
import { useSessionContext } from '../../SessionContextProvider';
import kyInstance from '@/lib/ky';
import LoadingButton from '@/components/LoadingButton';

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
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
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
    <div className=" mx-auto p-4 w-full">
      {customer && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{customer.name}</h1>
          <div className="flex flex-col sm:flex-row sm:space-x-6">
            <div className="mb-2 sm:mb-0">
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> {customer.mobileNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Address:</span> {customer.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col w-full sm:flex-row justify-between items-start sm:items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-1 ">
                  <p className="text-gray-800 font-extrabold text-xl mb-3">
                   {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold text-gray-800">Product Count:</span> {invoice.productCount}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold text-gray-800">Total Paid:</span> ₹{invoice.totalAmountPaid.toFixed(2)}
                  </p>
                  <p className=" text-sm text-red-800">
                    <span className="font-semibold ">Due Amount:</span> ₹{invoice.dueAmount.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 sm:mt-0">
                  <LoadingButton
                    loading={isDownloading === invoice.id}
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Download Invoice
                  </LoadingButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No invoices found for this customer.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerInvoice;
