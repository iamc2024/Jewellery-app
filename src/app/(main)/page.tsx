import type { Rate as RateType } from '@prisma/client';
import InvoiceForm from './InvoiceForm';
import RateComponent from './rates/Rate';
import { formatDate } from '@/lib/fomatDate';

import prisma from '@/lib/prisma';
import { validateRequest } from '@/auth';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const HomePage = async () => {
   const { user } = await validateRequest();
   if (!user) throw new Error('unauthorized');

   console.log('this is getting executed');

   const currentDate = new Date();
   const formattedDate = formatDate(currentDate);
   console.log('this is formatted date', formattedDate);

   const [rate, userData]: [
      RateType | null,
      { isMember: boolean; invoiceCount: number } | null,
   ] = await prisma.$transaction([
      prisma.rate.findFirst({
         where: {
            date: formattedDate,
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
            Rates: {
               where: {
                  date: formattedDate, // Start of today
               },
            },
         },
      }),
   ]);

   if (!userData) throw new Error('User not found');
   console.log('this is rate', userData);

   return (
      <div className="min-h-screen w-full space-y-5">
         <RateComponent rate={rate} />

         {rate ? (
            userData.invoiceCount < 5 || userData.isMember ? (
               <InvoiceForm
                  invoiceCount={userData.invoiceCount}
                  rates={rate}
                  isMember={userData.isMember}
               />
            ) : (
               <div className="text-center text-destructive flex flex-col gap-3">
                  You have reached the limit of free invoices
                  <span className="text-muted-foreground">
                     Upgrade to premium for unlimited invoices
                  </span>
                  <Link href="/membership">
                  
                     <Button
                        variant="default"
                        size="sm"
                        className="max-w-xs bg-green-700 hover:bg-green-900"
                     >
                        Become a Member
                     </Button>
                  </Link>
               </div>
            )
         ) : null}
      </div>
   );
};

export default HomePage;

// if rate is not there show only rate comp and if rate is there then check for (invoic count < 5 || isMember) then show invoice form else show message
