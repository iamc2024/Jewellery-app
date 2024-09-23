'use client';

import { Button } from '@/components/ui/button';
import NewInvoiceDialog from './NewInvoiceDialog';
import { useState } from 'react';
import type { Customer, Rate } from '@prisma/client';
import InvoiceForm from './InvoiceForm';
import RateComponent from './rates/Rate';
import { formatDate } from '@/lib/fomatDate';
import { useQuery } from '@tanstack/react-query';
import kyInstance from '@/lib/ky';
import { Loader2 } from 'lucide-react';
import { useSessionContext } from './SessionContextProvider';
import { getRemainingDays } from '@/lib/membershipUtils';

const HomePage = () => {
   const { userData } = useSessionContext();

   const [customer, setCustomer] = useState<Customer | null>(null);
   const {
      data: rates,
      isLoading,
      isError,
      error,
   } = useQuery({
      queryKey: ['rates'],
      queryFn: async () => {
         const fetchedRates = await kyInstance
            .get(`/api/rate/${formatDate(new Date())}`)
            .json<Rate>();
         return fetchedRates;
      },
      retry: 0,
   });
   if (isLoading) {
      return (
         <div className="min-h-screen w-full">
            <Loader2 className="mx-auto my-3 animate-spin" />
         </div>
      );
   }

   return (
      <div className="min-h-screen w-full space-y-5">
         <RateComponent rates={rates} />

         {rates && ((userData.invoiceCount < 5 || userData.isMember) ? (
            <>
               <NewInvoiceDialog setCustomer={setCustomer} />
               <InvoiceForm
                  invoiceCount={userData.invoiceCount}
                  customer={customer}
                  rates={rates}
                  setCustomer={setCustomer}
                  isMember={userData.isMember}
               />
            </>
         ) : (
            <div className="text-center text-destructive">
               You have reached the limit of free invoices
            </div>
         ))}
      </div>
   );
};

export default HomePage;
