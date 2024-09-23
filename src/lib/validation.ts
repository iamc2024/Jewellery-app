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
   description: z.string(),
   purity: z.nativeEnum(Purity),
   netQuantity: z.preprocess((a) => Number(a), z.number().nonnegative()),
   GrossWeight: z.preprocess((a) => Number(a), z.number().nonnegative()),
   netStoneWeight: z.preprocess((a) => Number(a), z.number().nonnegative()),
   stonePrice: z.preprocess((a) => Number(a), z.number().nonnegative()),
   GrossProductPrice: z.preprocess((a) => Number(a), z.number().nonnegative()),
   MakingCharge: z.preprocess((a) => Number(a), z.number().nonnegative()),
   discount: z.preprocess((a) => Number(a), z.number().min(0).max(100)),
   CGST: z.preprocess((a) => Number(a), z.number().nonnegative()),
   SGST: z.preprocess((a) => Number(a), z.number().nonnegative()),
   CGSTAmount: z.preprocess((a) => Number(a), z.number().nonnegative()),
   SGSTAmount: z.preprocess((a) => Number(a), z.number().nonnegative()),
   productValue: z.preprocess((a) => Number(a), z.number().nonnegative()),
   
 });
 

export type ProductValues = z.infer<typeof productSchema>;


export const invoiceSchema = z.object({
   customerId: z.string(),
   rateId: z.string(),
   totalAmount: z.preprocess((a) => Number(a), z.number().nonnegative()),
   paidAmount: z.preprocess((a) => Number(a), z.number().nonnegative()),
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