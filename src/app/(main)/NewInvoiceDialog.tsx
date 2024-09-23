'use client';

import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import kyInstance from '@/lib/ky';
import type { Customer } from '@prisma/client';
import { useState, useTransition } from 'react';
import { set } from 'zod';

interface NewInvoiceDialogProps {
   setCustomer: (customer: Customer) => void;
}

const NewInvoiceDialog = ({ setCustomer }: NewInvoiceDialogProps) => {
   const [isPending, startTransaction] = useTransition();
   const [error, setError] = useState<string>();

   const [mobileNumber, setMobileNumber] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      startTransaction(async () => {
         try {
         const customer = await kyInstance
               .post('/api/customers/search', { json: { mobileNumber } })
               .json<Customer>();
            setCustomer(customer);
            setMobileNumber('');
         } catch (error) {
            console.error(error);
            setError('Customer not found');
            setTimeout(() => {
               setError(undefined);
            }, 3000);
         }
      });
   };

   return (
      <>
         {error && <p className="text-center text-destructive">{error}</p>}
         <div className="mx-auto flex items-center gap-3 bg-card ">
            <Input
               className=""
               placeholder="Mobile Number"
               value={mobileNumber}
               onChange={(e) => setMobileNumber(e.target.value)}
            />
            <div className="flex h-fit gap-3">
               <LoadingButton loading={isPending} onClick={handleSubmit}>
                  Add Invoice
               </LoadingButton>
            </div>
         </div>
      </>
   );
};

export default NewInvoiceDialog;
