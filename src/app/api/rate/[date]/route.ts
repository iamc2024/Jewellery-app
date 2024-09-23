import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';

export const GET = async (
   req: Request,
   { params: { date } }: { params: { date: string } },
) => {
   try {
      const { user } = await validateRequest();
      if (!user) {
         return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
         });
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
         return new Response(JSON.stringify({ error: 'Invalid date format' }), {
            status: 400,
         });
      }

      const rate = await prisma.rate.findFirst({
         where: {
            date: date,
            adminId: user.id,
         },
      });

      if (!rate) {
         return new Response(
            JSON.stringify({ error: 'Rate not found for the given date' }),
            { status: 404 },
         );
      }

      return new Response(JSON.stringify(rate));
   } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
         status: 500,
      });
   }
};
