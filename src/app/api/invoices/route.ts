import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import type { InvoicePage } from '@/lib/types';
import type { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
   try {
      const { user } = await validateRequest();
      if (!user) return new Response('Unauthorized', { status: 403 });

      const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

      const pageSize = 10;

      const invoices = await prisma.invoice.findMany({
         where: { adminId: user.id },
         orderBy: { createdAt: 'desc' },
         take: pageSize + 1,
         cursor: cursor ? { id: cursor } : undefined,
         
         include: {
            customer: true,
         },
      });

      const nextCursor =
         invoices.length > pageSize ? invoices[pageSize].id : null;

      const data:InvoicePage = { invoices: invoices.slice(0, pageSize), nextCursor };

      return Response.json(data);
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'internal server error' }, { status: 500 });
   }
};


