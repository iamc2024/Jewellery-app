'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
   useMutation,
   useQueryClient,
   type QueryKey,
} from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   Form,
   FormField,
   FormLabel,
   FormControl,
   FormMessage,
   FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/LoadingButton';
import type { Rate } from '@prisma/client';
import { rateSchema, type RateValues } from '@/lib/validation';
import { submitRates } from './action';
import { formatDate } from '@/lib/fomatDate';

interface RateProps {
   rate: Rate | null;
}

const Rate = ({ rate: rates }: RateProps) => {


   const [error, setError] = useState<string>();
   const [currentDate, setCurrentDate] = useState<string>('');
   const [rateData, setRateData] = useState<Rate | null>(rates);

   const queryClient = useQueryClient();

   const form = useForm<RateValues>({
      resolver: zodResolver(rateSchema),
      defaultValues: {
         date: '',
         gold14K: '',
         gold18K: '',
         gold22K: '',
         gold24K: '',
         Platinum95: '',
      },
   });
   useEffect(() => {
      const currentDate = formatDate( new Date());
      setCurrentDate(currentDate); 
      console.log('this is current date', currentDate) 
      form.setValue('date', currentDate);
   }, [form]);

const mutation = useMutation({
   mutationFn: submitRates,
   onSuccess: (data) => {
      if (data.createdRate) {
         form.reset();
         setRateData(data.createdRate);
         setError(undefined);
         window.location.reload(); // Refresh the page
      }
   },
   onError: (error) => {
      console.error('Error adding rates:', error);
      setError('Failed to add rates. Please try again.');
   },
});
   const onSubmit = (values: RateValues) => {
      setError(undefined);
      mutation.mutate({ rates: values });
   };

   if (rateData) {
      return (
         <div className="w-full rounded-md bg-white p-4 shadow-sm">
            <div className="mb-4">
               <h2 className="text-lg font-semibold text-gray-800">
                  Today's Rates ({rateData.date}):
               </h2>
            </div>

            <div className="-mx-2 flex flex-wrap">
               <div className="mb-4 w-full px-2 sm:w-1/2 md:w-1/3">
                  <div className="flex items-center justify-between rounded-md border p-2 transition-colors duration-200 hover:bg-gray-50">
                     <span className="text-gray-600">Gold 14K:</span>
                     <span className="font-medium text-gray-800">
                        ₹{rateData.gold14K}
                     </span>
                  </div>
               </div>

               <div className="mb-4 w-full px-2 sm:w-1/2 md:w-1/3">
                  <div className="flex items-center justify-between rounded-md border p-2 transition-colors duration-200 hover:bg-gray-50">
                     <span className="text-gray-600">Gold 18K:</span>
                     <span className="font-medium text-gray-800">
                        ₹{rateData.gold18K}
                     </span>
                  </div>
               </div>

               <div className="mb-4 w-full px-2 sm:w-1/2 md:w-1/3">
                  <div className="flex items-center justify-between rounded-md border p-2 transition-colors duration-200 hover:bg-gray-50">
                     <span className="text-gray-600">Gold 22K:</span>
                     <span className="font-medium text-gray-800">
                        ₹{rateData.gold22K}
                     </span>
                  </div>
               </div>

               <div className="mb-4 w-full px-2 sm:w-1/2 md:w-1/3">
                  <div className="flex items-center justify-between rounded-md border p-2 transition-colors duration-200 hover:bg-gray-50">
                     <span className="text-gray-600">Gold 24K:</span>
                     <span className="font-medium text-gray-800">
                        ₹{rateData.gold24K}
                     </span>
                  </div>
               </div>

               <div className="mb-4 w-full px-2 sm:w-1/2 md:w-1/3">
                  <div className="flex items-center justify-between rounded-md border p-2 transition-colors duration-200 hover:bg-gray-50">
                     <span className="text-gray-600">Platinum 95%:</span>
                     <span className="font-medium text-gray-800">
                        ₹{rateData.Platinum95}
                     </span>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="mx-auto flex max-w-full flex-col space-y-4 rounded-md bg-white p-4 shadow-sm"
            >
               {error && <p className="text-center text-red-500">{error}</p>}

               <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                     <FormItem className="hidden">
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <p className="text-center text-base font-semibold text-gray-700">
                  Current Date: {currentDate}
               </p>

               <FormField
                  control={form.control}
                  name="gold14K"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Gold 14K</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter Gold 14K rate"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="gold18K"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Gold 18K</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter Gold 18K rate"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="gold22K"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Gold 22K</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter Gold 22K rate"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="gold24K"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Gold 24K</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter Gold 24K rate"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="Platinum95"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Platinum 95%</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter Platinum 95% rate"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <LoadingButton
                  loading={mutation.isPending}
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
               >
                  Add Rates
               </LoadingButton>
            </form>
         </Form>
      </div>
   );
};

export default Rate;
