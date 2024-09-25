import { Prisma, type Customer, type Product, type Rate, type User } from '@prisma/client';

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
export interface InvoicePrintData {
   id: string;
   customerId: string;
   totalAmount: number;
   paidAmount: number;
   dueAmount: number;
   rateId: string;
   adminId: string;
   createdAt: Date;
   products: Product[];
   customer: Customer;
   rate: Rate
   user: User
}

const invoice = {
   id: '3906ef4e-c5a3-4e3c-97cb-d83fc7a90d48',
   customerId: '58f1f285-d685-45f7-a32b-3be4666a211e',
   totalAmount: 1.019898,
   paidAmount: 1,
   dueAmount: 0.01989800000000019,
   rateId: '65971f59-ac84-4908-8e16-d5746cae1716',
   adminId: 'zeb3vn37exs2nbu4',
   createdAt: '2024-09-23T05:47:05.164Z',
   products: [
      {
         id: '697df286-d948-47e7-894e-07cad6f48a5b',
         description: '1',
         purity: 'K14',
         netQuantity: 1,
         GrossWeight: 1,
         GrossProductPrice: 1,
         netStoneWeight: 1,
         stonePrice: 1,
         MakingCharge: 1,
         discount: 1,
         InvoiceId: '3906ef4e-c5a3-4e3c-97cb-d83fc7a90d48',
         CGST: 1,
         SGST: 1,
         productValue: 1.019898,
         MakingChargeValue: 0.01,
         CGSTValue: 0.01,
         SGSTValue: 0.01,
         DiscountValue: 0.01,
      },
   ],
   customer: {
      id: '58f1f285-d685-45f7-a32b-3be4666a211e',
      name: 'Kapil Bamotriya',
      mobileNumber: '0000000000',
      address: 'adresss',
      adminId: 'zeb3vn37exs2nbu4',
   },
   rate: {
      id: '65971f59-ac84-4908-8e16-d5746cae1716',
      date: '2024-09-23',
      gold14K: 1500,
      gold18K: 1500,
      gold22K: 1500,
      gold24K: 1500,
      Platinum95: 1500,
      adminId: 'zeb3vn37exs2nbu4',
      createdAt: '2024-09-23T05:04:23.790Z',
   },
   user: {
      id: 'zeb3vn37exs2nbu4',
      username: 'testuser',
      displayName: 'testuser',
      passwordHash:
         '$argon2id$v=19$m=19456,t=2,p=1$332i/its2PNWd6QUT2P3PA$e5UfECYU6wP2OOk95H6Pqd3Rv6W+WeeTwCki2JXUMWY',
      googleId: null,
      email: 'test@email.com',
      companyName: 'test store',
      address: 'test address',
      invoiceCount: 5,
      isMember: false,
      membershipId: null,
      membershipStart: null,
      membershipEnd: null,
      createdAt: '2024-09-23T04:55:32.777Z',
   },
}