'use client';

import { customerSchema, type CustomerValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { addCustomer } from './actions';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/LoadingButton';

const newCustomer = () => {
   const [error, setError] = useState<string>();
   const [isPending, startTransition] = useTransition();

   const form = useForm<CustomerValues>({
      resolver: zodResolver(customerSchema),
      defaultValues: {
         name: '',
         mobileNumber: '',
         address: '',
      },
   });

   const handleSubmit = async (values: CustomerValues) => {
      setError(undefined);
      startTransition(async () => {
         const { error } = await addCustomer(values);
         if (error) setError(error);
      });
   };

   return (
      <div className="w-full">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(handleSubmit)}
               className="space-y-3"
            >
               {error && (
                  <p className="text-center text-destructive">{error}</p>
               )}
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                           <Input placeholder="Contact Number" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>address</FormLabel>   
                        <FormControl>
                           <Textarea placeholder="address" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <LoadingButton loading={isPending} type="submit">
                  Add Customer
               </LoadingButton>
            </form>
         </Form>
      </div>
   );
};
export default newCustomer;
