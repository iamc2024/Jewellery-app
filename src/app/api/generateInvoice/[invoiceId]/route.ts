import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (
   req: Request,
   { params: { invoiceId } }: { params: { invoiceId: string } },
) => {
   try {
      const { user } = await validateRequest();
      if (!user) return new NextResponse('Unauthorized', { status: 403 });

      const invoice = await prisma.invoice.findUnique({
         where: { id: invoiceId },
         include: {
            products: true,
            customer: true,
            rate: true,
            user: true,
         },
      });

      if (!invoice) return new NextResponse('Not found', { status: 404 });


      return  Response.json(invoice)
      
   } catch (error) {
      console.error('Error during PDF generation:', error);
      return new NextResponse('Internal server error', { status: 500 });
   }
};
