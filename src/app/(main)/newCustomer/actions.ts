'use server';

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { customerSchema, type CustomerValues } from '@/lib/validation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

export const addCustomer = async (customer: CustomerValues) => {
   try {
      const { user: loggedInUser } = await validateRequest();
      if (!loggedInUser) {
         throw new Error('unauthorized');
      }

      const {
         name,
         mobileNumber,
         address,
      } = customerSchema.parse(customer);

      await prisma.customer.create({
         data: {
            name,
            mobileNumber,
            address,
            adminId: loggedInUser.id,
         },
      });

      return redirect('/customers');
   } catch (error) {
      console.error(error);
      if (isRedirectError(error)) throw error;

      return {
         error: 'something went wrong ',
      };
   }
};
