

import type {  Rate as RateType } from '@prisma/client';
import InvoiceForm from './InvoiceForm';
import RateComponent from './rates/Rate';
import { formatDate } from '@/lib/fomatDate';

import kyInstance from '@/lib/ky';
import prisma from '@/lib/prisma';
import { validateRequest } from '@/auth';


const HomePage = async () => {
   const {user} = await validateRequest();
   if(!user) throw new Error('unauthorized');

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

   if(!userData) throw new Error('User not found');
   


   // const url = `/api/rate/${formatDate(new Date())}`
   // console.log('this is url', url)
   // const initialRatesAndUserData = await kyInstance
   //    .get(`/api/rate/${formatDate(new Date())}`)
   //    .json<{rate: RateType, userData: {isMember: boolean, invoiceCount: number}}>();

   return (
      <div className="min-h-screen w-full space-y-5">
      <RateComponent rate={rate} />
    
      {rate ? (
        (userData.invoiceCount < 5 || userData.isMember) ? (
          <InvoiceForm
            invoiceCount={userData.invoiceCount}
            rates={rate}
            isMember={userData.isMember}
          />
        ) : (
          <div className="text-center text-destructive">
            You have reached the limit of free invoices
          </div>
        )
      ) : null}
    </div>
   );
};

export default HomePage;


// if rate is not there show only rate comp and if rate is there then check for (invoic count < 5 || isMember) then show invoice form else show message