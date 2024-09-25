import { string, z } from 'zod';

const requiredString = z.string().trim().min(1, 'Required');
export const signUpSchema = z.object({
   email: requiredString.email('Invalid email'),
   username: requiredString.regex(
      /^[A-Za-z0-9_-]+$/,
      'only letters, numbers, _, and - are allowed',
   ),
   password: requiredString.min(8, 'Minimum 8 characters'),
   companyName: requiredString,
   address: requiredString,
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
   email: requiredString.email('Invalid email'),
   password: requiredString.min(8, 'Minimum 8 characters'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const customerSchema = z.object({
   name: requiredString,
   email: z.string().email().optional(),
   mobileNumber: requiredString.regex(/^\d{10}$/, 'Invalid phone number'),
   address: requiredString,
});

export type CustomerValues = z.infer<typeof customerSchema>;

export enum Purity {
   K14 = 'K14',
   K18 = 'K18',
   K22 = 'K22',
   K24 = 'K24',
   Platinum95 = 'Platinum95',
}

export const productSchema = z.object({
   description: z.string().min(1, 'Required'),
   purity: z.nativeEnum(Purity, { errorMap: () => ({ message: 'cannot be negative' }) }),
   netQuantity: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   GrossWeight: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   netStoneWeight: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   stonePrice: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   GrossProductPrice: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   MakingCharge: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   discount: z.preprocess((a) => Number(a), z.number().min(0).max(100, 'cannot be negative')),
   CGST: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   SGST: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   CGSTAmount: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   SGSTAmount: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
   productValue: z.preprocess((a) => Number(a), z.number().nonnegative('cannot be negative')),
});
 

export type ProductValues = z.infer<typeof productSchema>;


export const invoiceSchema = z.object({
   customerId: z.string(),
   rateId: z.string(),
   totalAmount: z.preprocess((a) => Number(a), z.number().nonnegative()),
   paidAmount: z.preprocess((a) => Number(a), z.number().nonnegative({ message: 'Invalid amount' })),
   dueAmount: z.preprocess((a) => Number(a), z.number().nonnegative()),
   customerName: z.string().min(1, 'Required'),
   customerPhone: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
   customerAddress: z.string().min(1, 'Required'),
   products: z.array(productSchema),
});
 
 export type InvoiceValues = z.infer<typeof invoiceSchema>;
 

export const rateSchema = z.object({
   date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
   }),
   gold14K: z.string().regex(/^\d+(\.\d+)?$/, 'rate must be a positive number'),
   gold18K: z.string().regex(/^\d+(\.\d+)?$/, 'rate must be a positive number'),
   gold22K: z.string().regex(/^\d+(\.\d+)?$/, 'rate must be a positive number'),
   gold24K: z.string().regex(/^\d+(\.\d+)?$/, 'rate must be a positive number'),
   Platinum95: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'rate must be a positive number'),
});

export type RateValues = z.infer<typeof rateSchema>