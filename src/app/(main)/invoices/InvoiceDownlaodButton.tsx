'use client';

import InvoiceDialoag from '@/app/compoents/InvoiceDialog';
import LoadingButton from '@/components/LoadingButton';
import kyInstance from '@/lib/ky';
import type { InvoicePrintData } from '@/lib/types';
import { Download } from 'lucide-react';
import { useState } from 'react';

const InvoiceDownlaodButton = ({ invoiceId }: { invoiceId: string }) => {
   const [invoice, setInvoice] = useState<InvoicePrintData | null>(null);
   const [isDownloading, setIsDownloading] = useState<boolean>(false);

   const setInvoiceData = async (id: string) => {
      setIsDownloading(true);
      try {
         const fetchedInvoice = await kyInstance
            .get(`/api/generateInvoice/${id}`)
            .json<InvoicePrintData>();
         if (fetchedInvoice) {
            setInvoice(fetchedInvoice);
         }
      } catch (error) {
         console.error(error);
      } finally {
         setIsDownloading(false);
      }
   };

   return (
      <div className='w-full flex flex-col'>
         {invoice ? (
            <InvoiceDialoag invoice={invoice} setInvoice={setInvoice} />
         ) : (
            <>
            <LoadingButton
               loading={isDownloading}
               onClick={() => setInvoiceData(invoiceId)}
               className=' text-xs px-2 hidden sm:inline-block self-end'
               >
               get Invoice
            </LoadingButton>
            <LoadingButton
               loading={isDownloading}
               onClick={() => setInvoiceData(invoiceId)}
               className=' text-xs px-2 inline-block sm:hidden self-end bg-none border'
               >
               <Download size={16} className='mr-1' />
            </LoadingButton>
            </>

         )}
      </div>
   );
};

export default InvoiceDownlaodButton;
