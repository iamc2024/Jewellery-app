import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import type { CustomerPage } from '@/lib/types';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
   try {
      const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

      const pageSize = 10;

      const { user } = await validateRequest();
      if (!user) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const customers = await prisma.customer.findMany({
         where: { adminId: user.id },
         orderBy: { name: 'desc' },
         take: pageSize + 1,
         cursor: cursor ? { id: cursor } : undefined,
      });

      const nextCursor =
         customers.length > pageSize ? customers[pageSize].id : null;

      const data: CustomerPage = {
         customers: customers.slice(0, pageSize),
         nextCursor,
      };

      return Response.json(data);
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'internal server error' }, { status: 500 });
   }
};
