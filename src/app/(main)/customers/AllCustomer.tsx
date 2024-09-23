'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { type CustomerPage } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import kyInstance from '@/lib/ky';


import CustomersTable from './customersTable';

const AllCustomers = () => {
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
   } = useInfiniteQuery({
      queryKey: ['customers'],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(
               '/api/customers',
               pageParam ? { searchParams: { cursor: pageParam } } : {},
            )
            .json<CustomerPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });

   const customers = data?.pages.flatMap((page) => page.customers) || [];

   if (status === 'pending') {
      return <Loader2 className="mx-auto my-3 animate-spin" />;
   }

   if (status === 'success' && !customers.length && !hasNextPage) {
      return (
         <p className="text-center text-muted-foreground">
            create a new customer to see them here.
         </p>
      );
   }

   if (status === 'error') {
      return (
         <p className="text-center text-destructive">
            An error occurred while loading customers.
         </p>
      );
   }

   return (
      <div className='w-full p-5'>
         <CustomersTable loadMore={() => fetchNextPage()} hasNextPage = {hasNextPage} isFetchingNextPage={isFetchingNextPage}  customers={customers} />

      </div>
   );
};
export default AllCustomers;
