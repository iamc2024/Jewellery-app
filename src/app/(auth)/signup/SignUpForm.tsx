'use client';

import { signUpSchema, type SignUpValues } from '@/lib/validation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from './actions';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/PasswordInput';
import LoadingButton from '@/components/LoadingButton';
import { Textarea } from '@/components/ui/textarea';

const SignUpForm = () => {
   const [error, setError] = useState<string>();
   const [isPending, startTransition] = useTransition();

   const form = useForm<SignUpValues>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         email: '',
         password: '',
         companyName: '',
         address: '',
      },
   });

   const onSubmit = async (values: SignUpValues) => {
      setError(undefined);
      startTransition(async () => {
         const { error } = await signUp(values);
         if (error) setError(error);
      });
   };

   return (
      <div>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className={'space-y-3'}
            >
               {error && (
                  <p className={'text-center text-destructive'}> {error}</p>
               )}              
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                           <Input placeholder="Store Name" {...field} />
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
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                           <Textarea placeholder="address" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <PasswordInput placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <LoadingButton
                  loading={isPending}
                  type="submit"
                  className="w-full"
               >
                  Create account
               </LoadingButton>
            </form>
         </Form>
      </div>
   );
};

export default SignUpForm;
