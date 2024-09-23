'use server';

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { rateSchema, type RateValues } from '@/lib/validation';

interface SubmitRatesProps {
   rates: RateValues;
}

export const submitRates = async ({ rates }: SubmitRatesProps) => {
   try {
      const { user } = await validateRequest();
      if (!user) {
         throw new Error('Unauthorized');
      }

      const validatedRates = rateSchema.parse(rates);

      const createdRate = await prisma.rate.create({
         data: {
            date: validatedRates.date,
            gold14K: parseFloat(validatedRates.gold14K),
            gold18K: parseFloat(validatedRates.gold18K),
            gold22K: parseFloat(validatedRates.gold22K),
            gold24K: parseFloat(validatedRates.gold24K),
            Platinum95: parseFloat(validatedRates.Platinum95),
            user: {
               connect: {
                  id: user.id,
               },
            },
         },
      });

      return {
         createdRate,
      };
   } catch (error) {
      console.error(error);
      return {
         error: 'Something went wrong',
      };
   }
};
