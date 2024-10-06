import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const DELETE = async (
   req: Request,
   { params: { invoiceId } }: { params: { invoiceId: string } },
) => {
   try {
      const { user } = await validateRequest();
      if (!user) return new NextResponse('Unauthorized', { status: 403 });

      const invoice = await prisma.invoice.findUnique({
         where: { id: invoiceId },
      });

      if (!invoice) return new NextResponse('Not found', { status: 404 });

      await prisma.invoice.deleteMany({
         where: { id: invoiceId },
      });

      return new NextResponse('Invoice deleted', { status: 200 });
   } catch (error) {
      console.error(error);
      return new NextResponse('Internal server error', { status: 500 });
   }
};
