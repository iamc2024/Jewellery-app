

import type {  Rate as RateType } from '@prisma/client';
import InvoiceForm from './InvoiceForm';
import RateComponent from './rates/Rate';
import { formatDate } from '@/lib/fomatDate';

import kyInstance from '@/lib/ky';
import prisma from '@/lib/prisma';
import { validateRequest } from '@/auth';


const HomePage = async () => {
   const {user} = await validateRequest();
   if(!user) return {}

   const [rate, userData]:[RateType | null, {isMember: boolean, invoiceCount: number} | null] = await prisma.$transaction([
      prisma.rate.findFirst({
      where: {
         date: formatDate(new Date()),
         adminId: user.id,
      },
      }),
      prisma.user.findFirst({
      where: {
         id: user.id,
      },
      select: {
         invoiceCount: true,
         isMember: true,
      },
      }),
   ]);
   if(!rate || !userData) return {}


   // const url = `/api/rate/${formatDate(new Date())}`
   // console.log('this is url', url)
   // const initialRatesAndUserData = await kyInstance
   //    .get(`/api/rate/${formatDate(new Date())}`)
   //    .json<{rate: RateType, userData: {isMember: boolean, invoiceCount: number}}>();

   return (
      <div className="min-h-screen w-full space-y-5">
         <RateComponent rate={rate} />

         {userData.invoiceCount < 5 || userData.isMember ? (
               <>
                  <InvoiceForm
                     invoiceCount={userData.invoiceCount}
                     rates={rate}
                     isMember={userData.isMember}
                  />
               </>
            ) : (
               <div className="text-center text-destructive">
                  You have reached the limit of free invoices
               </div>
            )}
      </div>
   );
};

export default HomePage;
