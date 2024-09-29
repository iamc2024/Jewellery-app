'use server';

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { invoiceSchema, type InvoiceValues } from '@/lib/validation';

interface CreateInvoiceProps {
   invoice: InvoiceValues;
}

export const createInvoice = async ({ invoice }: CreateInvoiceProps) => {
   try {
      const { user } = await validateRequest();
      if (!user) {
         throw new Error('Unauthorized');
      }

      const validatedInvoice = invoiceSchema.parse(invoice);

      const userData = await prisma.user.findUnique({
         where: { id: user.id },
         select: { invoiceCount: true, isMember: true },
      });

      if (!userData) {
         throw new Error('User not found');
      }

      if(!userData.isMember && userData.invoiceCount >= 5) {
         throw new Error('You have reached the limit of free invoices');
      }
      
      

      const createdInvoice = await prisma.invoice.create({
         data: {
            customer: {
               connectOrCreate: {
                  where: {
                     adminId_mobileNumber: {
                        adminId: user.id,
                        mobileNumber: validatedInvoice.customerPhone,
                     },
                  },
                  create: {
                     name: validatedInvoice.customerName,
                     mobileNumber: validatedInvoice.customerPhone,
                     address: validatedInvoice.customerAddress,
                     adminId: user.id,
                  },
               },
            },
            products: {
               create: validatedInvoice.products.map((product) => ({
                  description: product.description,
                  purity: product.purity,
                  netQuantity: product.netQuantity,
                  GrossWeight: product.GrossWeight,
                  GrossProductPrice: product.GrossProductPrice,
                  netStoneWeight: product.netStoneWeight,
                  stonePrice: product.stonePrice,
                  discount: product.discount,
                  MakingCharge: product.MakingCharge,
                  CGST: product.CGST,
                  SGST: product.SGST,
                  productValue: product.productValue,
                  MakingChargeValue:
                     (product.GrossProductPrice * product.MakingCharge) / 100,
                  CGSTValue: (product.GrossProductPrice * product.CGST) / 100,
                  SGSTValue: (product.GrossProductPrice * product.SGST) / 100,
                  DiscountValue:
                     (product.GrossProductPrice * product.discount) / 100,
               })),
            },
            rate: {
               connect: { id: validatedInvoice.rateId },
            },
            user: {
               connect: { id: user.id },
            },
            totalAmount: validatedInvoice.totalAmount,
            paidAmount: validatedInvoice.paidAmount,
            dueAmount: validatedInvoice.dueAmount,
         },
      });

      await prisma.user.update({
         where: { id: user.id },
         data: {
            invoiceCount: {
               increment: 1,
            },
         },
      });

      return {
         createdInvoice,
      };
   } catch (error) {
      console.error(error);
      return {
         error: 'Something went wrong',
      };
   }
};
