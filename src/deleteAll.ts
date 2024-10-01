import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllRecords() {
   try {
      // Delete all records from each model
      await prisma.product.deleteMany({});
      await prisma.invoice.deleteMany({});
      await prisma.user.deleteMany({});

      console.log('All records deleted successfully');
   } catch (error) {
      console.error('Error deleting records:', error);
   } finally {
      await prisma.$disconnect();
   }
}

deleteAllRecords();
