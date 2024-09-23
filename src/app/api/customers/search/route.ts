import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';

export const POST = async (req: Request) => {
   try {
      const { user: loggedInUser } = await validateRequest();

      if (!loggedInUser) {
         return Response.json({ error: 'unauthorized' }, { status: 401 });
      }

      if (!req.body) {
         return Response.json({ error: 'invalid request' }, { status: 400 });
      }
      const body = await req.json();

      if (!body || !body.mobileNumber) {
         return Response.json({ error: 'invalid request' }, {
            status: 400,
         });
      }

      const { mobileNumber } = body;

      const customer = await prisma.customer.findFirst({
         where: {
            mobileNumber,
            adminId: loggedInUser.id,
         },
      });

      if (!customer) {
         return Response.json({ error: 'customer not found' }, { status: 404 });
      }

      return Response.json({
         name: customer.name,
         mobileNumber: customer.mobileNumber,
         address: customer.address,
         id: customer.id,
      });
   } catch (error) {
      console.error(error);
      return Response.json({ error: 'internal server error' }, { status: 500 });
   }
};
