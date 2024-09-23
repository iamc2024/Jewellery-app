
import prisma from '@/lib/prisma';
import { cache } from 'react';


import { validateRequest } from '@/auth';
import { notFound } from 'next/navigation';
import CustomerInvoice from './CustomerInvoices';



interface PageProps {
   params: {
      customerId: string;
   };
}
const getCustomerById = cache(async (customerId: string) => {
   const customer = await prisma.customer.findUnique({
      where: {
         id: customerId,
      },
   });

   if (!customer) notFound();

   return customer;
});

export const generateMetadata = async ({
   params: { customerId },
}: PageProps) => {
   const { user } = await validateRequest();
   if (!user) return {};

   const customer = await getCustomerById(customerId);

   return {
      title: `Customer: ${customer.name}`,
   };
};

const customerPage = async ({ params: { customerId } }: PageProps) => {
    const customer = await getCustomerById(customerId);
    return (
        <div className='w-full'>
            <CustomerInvoice params={{ customerId }}  /> 
        </div>
    )
}

export default customerPage;

