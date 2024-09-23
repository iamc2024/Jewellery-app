'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { type InvoicePage } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import kyInstance from '@/lib/ky';

import InvoicesTable from './InvoiceTable';

const AllInvoices = () => {
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
   } = useInfiniteQuery({
      queryKey: ['invoices'],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(
               '/api/invoices',
               pageParam ? { searchParams: { cursor: pageParam } } : {},
            )
            .json<InvoicePage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });

   const invoices = data?.pages.flatMap((page) => page.invoices) || [];

   if (status === 'pending') {
      return <Loader2 className="mx-auto my-3 animate-spin" />;
   }

   if (status === 'success' && !invoices.length && !hasNextPage) {
      return (
         <p className="text-center text-muted-foreground">
            No invoices found. Create a new invoice to see them here.
         </p>
      );
   }

   if (status === 'error') {
      return (
         <p className="text-center text-destructive">
            An error occurred while loading invoices.
         </p>
      );
   }

   return (
      <div className='w-full'>
         <InvoicesTable loadMore={() => fetchNextPage()} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} invoices={invoices} />
      </div>
   );
};

export default AllInvoices;