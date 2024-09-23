import { Prisma, type Customer, type Product } from '@prisma/client';

export interface CustomerPage {
   customers: Customer[];
   nextCursor: string | null;
}


export interface InvoiceData {
   id: string;
   customerId: string
   totalAmount: number;
   paidAmount: number;
   dueAmount: number;
   rateId: string;
   adminId: string;
   createdAt: Date;
   customer: Customer;

}

export interface InvoicePage {
   invoices: InvoiceData[];
   nextCursor: string | null;
}