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

import type { Customer } from '@prisma/client';
import Link from 'next/link';

interface CustomersTableProps {
   customers: Customer[];
   loadMore: () => void;
   hasNextPage: boolean;
   isFetchingNextPage: boolean;
}

const CustomersTable = ({
   customers,
   loadMore,
   hasNextPage,
   isFetchingNextPage,
}: CustomersTableProps) => {
   return (
      <div className="w-full bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="">Name</TableHead>
                  <TableHead className="text-right">Phone Number</TableHead>
               </TableRow>
            </TableHeader>

            <TableBody>
               {customers.map((customer) => (
                  <TableRow key={customer.mobileNumber}>
                     <TableCell className="font-medium">
                        <Link
                           href={`/customers/${customer.id}`}
                           key={customer.mobileNumber}
                           className="hover:underline text-blue-800"
                        >
                           {customer.name}
                        </Link>
                     </TableCell>
                     <TableCell className="text-right">
                        {customer.mobileNumber}
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
                        load more
                     </Button>
                  )}
               </div>
            </TableBody>
         </Table>
      </div>
   );
};
export default CustomersTable;
