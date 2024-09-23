import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import kyInstance from '@/lib/ky';

import type { InvoiceData } from '@/lib/types';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface InvoicesTableProps {
   invoices: InvoiceData[];
   loadMore: () => void;
   hasNextPage: boolean;
   isFetchingNextPage: boolean;
}

const InvoicesTable = ({
   invoices,
   loadMore,
   hasNextPage,
   isFetchingNextPage,
}: InvoicesTableProps) => {

    const [isDownloading, setIsDownloading] = useState<string | null>(null); // Track downloading per invoice

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
        } finally {
          setIsDownloading(null);
        }
      };

   return (
      <div className="w-full bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className='text-xs sm:text-base'>Customer Name</TableHead>
                  <TableHead className='text-xs sm:text-base'>Created</TableHead>
                  <TableHead className='text-xs sm:text-base'>Total Amount</TableHead>
                  <TableHead className='hidden sm:inline-block'>Paid Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>

            <TableBody>
               {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                     <TableCell className=" text-xs sm:text-base font-bold cursor-pointer capitalize text-blue-800">
                        <Link
                           href={`/customers/${invoice.customerId}`}
                           key={invoice.id}
                           className="hover:underline"
                        >
                           {invoice.customer.name}
                        </Link>
                     </TableCell>
                     <TableCell className='text-xs sm:text-base'>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                     <TableCell className='text-xs sm:text-base'>{invoice.totalAmount}</TableCell>
                     <TableCell className='hidden sm:inline-block'>{invoice.paidAmount}</TableCell>
                     <TableCell className="text-right">
                        <LoadingButton 
                        variant={'outline'} 
                        className='text-xs px-2 hidden sm:inline-block'
                        loading={isDownloading === invoice.id}
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                           Download
                        </LoadingButton>
                        <LoadingButton 
                        variant={'outline'} 
                        className='text-xs px-2 inline-block sm:hidden'
                        loading={isDownloading === invoice.id}
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                           <Download size={16} className='mr-1' /> 
                        </LoadingButton>
                     </TableCell>
                  </TableRow>
               ))}
               <div className="flex w-full items-center gap-3 pt-4">
                  {hasNextPage && !isFetchingNextPage && (
                     <Button
                        variant={'outline'}
                        onClick={loadMore}
                        className="mt-4"
                     >
                        Load More
                     </Button>
                  )}
               </div>
            </TableBody>
         </Table>
      </div>
   );
};

export default InvoicesTable;