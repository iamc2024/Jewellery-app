import { Button } from '@/components/ui/button';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';

import type { InvoiceData } from '@/lib/types';
import Link from 'next/link';
import InvoiceDownlaodButton from './InvoiceDownlaodButton';

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
                        <Link
                           href={`/customers/${invoice.customerId}`}
                           key={invoice.id}
                           className="hover:underline"
                        >
                     <TableCell className=" text-xs sm:text-base font-bold cursor-pointer capitalize text-blue-800">
                           {invoice.customer.name}
                     </TableCell>
                        </Link>
                     <TableCell className='text-xs sm:text-base'>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                     <TableCell className='text-xs sm:text-base'>{invoice.totalAmount}</TableCell>
                     <TableCell className='hidden sm:inline-block'>{invoice.paidAmount}</TableCell>
                     <TableCell className="text-right">
                        <InvoiceDownlaodButton invoiceId={invoice.id} />
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