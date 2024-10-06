import { string, z } from 'zod';

const requiredString = z.string().trim().min(1, 'Required');
export const signUpSchema = z.object({
   email: requiredString.email('Invalid email'),
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

export const productSchema = z.object({
   description: requiredString,
   purity: z.enum(['K14', 'K18', 'K22', 'K24', 'Platinum95']),
   netQuantity: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'NetQuantity must be a positive number'),
   GrossWeight: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'GrossWeight must be a positive number'),
   netStoneWeight: z
   .string()
   .regex(/^\d+(\.\d+)?$/, 'GrossWeight must be a positive number'),
   stonePrice: z
   .string()
   .regex(/^\d+(\.\d+)?$/, 'GrossWeight must be a positive number'),
   GrossProductPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'GrossProductPrice must be a positive number'),
   MakingCharge: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'MakingCharge must be a positive number'),
   discount: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'Discount must be a number')
      .optional(),
   CGST: z.string().regex(/^\d+(\.\d+)?$/, 'CGST must be a positive number'),
   SGST: z.string().regex(/^\d+(\.\d+)?$/, 'SGST must be a positive number'),
   productValue: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'ProductValue must be a positive number'),
   CGSTAmount: z
   .string()
   .regex(/^\d+(\.\d+)?$/, 'GST must be a positive number'),
   SGSTAmount: z
   .string()
   .regex(/^\d+(\.\d+)?$/, 'GST must be a positive number'),
});

export type ProductValues = z.infer<typeof productSchema>;

// Add these fields to your invoiceSchema
export const invoiceSchema = z.object({
   customerId: z.string().min(1, 'Customer ID is required'),
   customerName: z.string().min(1, 'Customer Name is required'),
   customerPhone: requiredString.regex(/^\d{10}$/, 'Invalid phone number'),
   customerAddress: z.string().min(1, 'Customer Address is required'),
   rateId: z.string().min(1, 'Rate ID is required'),
   totalAmount: z
     .string()
     .regex(/^\d+(\.\d+)?$/, 'TotalAmount must be a positive number'),
   paidAmount: z
     .string()
     .regex(/^\d+(\.\d+)?$/, 'PaidAmount must be a positive number'),
   dueAmount: z
     .string()
     .regex(/^\d+(\.\d+)?$/, 'DueAmount must be a positive number'),
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