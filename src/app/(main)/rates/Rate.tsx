
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
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

interface RateProps {
  rates: Rate | undefined;
}

const Rate = ({ rates }: RateProps) => {
  const [error, setError] = useState<string>();
  const [currentDate, setCurrentDate] = useState<string>('');

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
    const currentDate = new Date().toISOString().split('T')[0];
    setCurrentDate(currentDate);
    form.setValue('date', currentDate);
  }, [form]);

  
  const mutation = useMutation({
   mutationFn: submitRates,
   onSuccess: (data) => {
      const queryKey: QueryKey = ['rates'];
      if (data.createdRate) {
         queryClient.invalidateQueries({ queryKey });
         form.reset();
         setError(undefined);
      }
   },
   onError: (error) => {
      console.error('Error adding rates:', error);
      setError('Failed to add rates. Please try again.');
   }
});

  
  const onSubmit = (values: RateValues) => {
    setError(undefined);
    mutation.mutate({rates: values});
  };

  
  if (rates) {
    return (
      <div className="w-full p-4 bg-white rounded-md shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Today's Rates ({rates.date}):
          </h2>
        </div>

        <div className="flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <div className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-600">Gold 14K:</span>
              <span className="font-medium text-gray-800">₹{rates.gold14K}</span>
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <div className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-600">Gold 18K:</span>
              <span className="font-medium text-gray-800">₹{rates.gold18K}</span>
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <div className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-600">Gold 22K:</span>
              <span className="font-medium text-gray-800">₹{rates.gold22K}</span>
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <div className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-600">Gold 24K:</span>
              <span className="font-medium text-gray-800">₹{rates.gold24K}</span>
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <div className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-600">Platinum 95%:</span>
              <span className="font-medium text-gray-800">₹{rates.Platinum95}</span>
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
          className="flex flex-col max-w-full mx-auto bg-white shadow-sm rounded-md p-4 space-y-4"
        >
          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

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

          <p className="text-center font-semibold text-gray-700 text-base">
            Current Date: {currentDate}
          </p>

          <FormField
            control={form.control}
            name="gold14K"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gold 14K</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Gold 14K rate" {...field} />
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
                  <Input placeholder="Enter Gold 18K rate" {...field} />
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
                  <Input placeholder="Enter Gold 22K rate" {...field} />
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
                  <Input placeholder="Enter Gold 24K rate" {...field} />
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
                  <Input placeholder="Enter Platinum 95% rate" {...field} />
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
