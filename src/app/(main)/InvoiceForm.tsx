'use client';

import React, { useState, useTransition, useEffect, useRef } from 'react';
import { DevTool } from '@hookform/devtools';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   Form,
   FormField,
   FormLabel,
   FormControl,
   FormMessage,
   FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/LoadingButton';
import type { Customer, Rate } from '@prisma/client';
import { invoiceSchema, InvoiceValues, Purity } from '@/lib/validation';
import { createInvoice } from './action';
import kyInstance from '@/lib/ky';
import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
   SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import InvoiceDialoag from '../compoents/InvoiceDialog';
import type { InvoicePrintData } from '@/lib/types';

interface InvoiceFormProps {
   rates: Rate;
   invoiceCount: number;
   isMember: boolean;
}

const InvoiceForm = ({
   rates,

   invoiceCount: invoiceC,
   isMember,
}: InvoiceFormProps) => {
   const [error, setError] = useState<string>();
   const [isPending, startTransition] = useTransition();
   const [invoice, setInvoice] = useState<InvoicePrintData | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [invoiceCount, setInvoiceCount] = useState(invoiceC);
   const [customer, setCustomer] = useState<Customer | null>(null);

   const router = useRouter();

   const purityOptions = [
      { label: '14K', value: 'K14' },
      { label: '18K', value: 'K18' },
      { label: '22K', value: 'K22' },
      { label: '24K', value: 'K24' },
      { label: 'Platinum95%', value: 'Platinum95' },
   ];

   const rateMap: { [key: string]: number } = {
      K14: rates.gold14K,
      K18: rates.gold18K,
      K22: rates.gold22K,
      K24: rates.gold24K,
      Platinum95: rates.Platinum95,
   };

   const form = useForm<InvoiceValues>({
      resolver: zodResolver(invoiceSchema),
      defaultValues: {
         customerId: customer?.id || '',
         rateId: rates.id,
         totalAmount: 0,
         paidAmount: 0,
         dueAmount: 0,

         customerName: customer?.name || '',
         customerPhone: customer?.mobileNumber || '',
         customerAddress: customer?.address || '',
         products: [
            {
               description: '',
               purity: '' as Purity,
               netQuantity: undefined,
               GrossWeight: undefined,
               netStoneWeight: 0,
               stonePrice: 0,
               GrossProductPrice: undefined,
               MakingCharge: undefined,
               discount: undefined,
               CGST: 1.5,
               SGST: 1.5,
               productValue: undefined,
               CGSTAmount: undefined,
               SGSTAmount: undefined,
            },
         ],
      },
      mode: 'onChange', //
   });

   const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: 'products',
   });

   const watchProducts = useWatch({
      control: form.control,
      name: 'products',
   });

   const prevCustomerRef = useRef<Customer | null>(customer);

   useEffect(() => {
      if (
         customer &&
         customer.id !== prevCustomerRef.current?.id &&
         !isSubmitting
      ) {
         form.reset({
            ...form.getValues(),
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.mobileNumber,
            customerAddress: customer.address,
         });
      }

      prevCustomerRef.current = customer;
   }, [customer, form, isSubmitting]);

   useEffect(() => {
      let totalAmount = 0;

      watchProducts.forEach((product, index) => {
         const purity = product?.purity || '';
         const rate = rateMap[purity] || 0;

         const GrossWeight = product?.GrossWeight || 0;
         const netStoneWeight = product?.netStoneWeight || 0;
         const stonePrice = product?.stonePrice || 0;

         const netMetalWeight = GrossWeight - netStoneWeight;
         const metalPrice = netMetalWeight * rate;

         const GrossProductPrice = metalPrice + stonePrice;

         const discountPercentage = product?.discount || 0;
         const discountAmount = (GrossProductPrice * discountPercentage) / 100;

         const priceAfterDiscount = GrossProductPrice - discountAmount;

         const MakingChargePercentage = product?.MakingCharge || 0;
         const MakingChargeAmount =
            (priceAfterDiscount * MakingChargePercentage) / 100;

         const priceAfterMakingCharge = priceAfterDiscount + MakingChargeAmount;

         const CGSTPercentage = product?.CGST || 0;
         const SGSTPercentage = product?.SGST || 0;
         const CGSTAmount = parseFloat(
            ((priceAfterMakingCharge * CGSTPercentage) / 100).toFixed(2),
         );
         const SGSTAmount = parseFloat(
            ((priceAfterMakingCharge * SGSTPercentage) / 100).toFixed(2),
         );

         const productValue = parseFloat(
            (priceAfterMakingCharge + CGSTAmount + SGSTAmount).toFixed(2),
         );

         if (
            product.GrossProductPrice !== GrossProductPrice ||
            product.productValue !== productValue ||
            product.CGSTAmount !== CGSTAmount ||
            product.SGSTAmount !== SGSTAmount
         ) {
            form.setValue(
               `products.${index}.GrossProductPrice`,
               GrossProductPrice || 0,
               {
                  shouldDirty: false,
                  shouldValidate: false,
               },
            );
            form.setValue(`products.${index}.productValue`, productValue || 0, {
               shouldDirty: false,
               shouldValidate: false,
            });
            form.setValue(`products.${index}.CGSTAmount`, CGSTAmount || 0, {
               shouldDirty: false,
               shouldValidate: false,
            });
            form.setValue(`products.${index}.SGSTAmount`, SGSTAmount || 0, {
               shouldDirty: false,
               shouldValidate: false,
            });
         }

         totalAmount += productValue;
      });

      const currentTotalAmount = form.getValues('totalAmount') || 0;

      if (currentTotalAmount !== totalAmount) {
         form.setValue('totalAmount', totalAmount || 0, {
            shouldDirty: false,
            shouldValidate: false,
         });

         const paidAmount = form.getValues('paidAmount') || 0;
         const dueAmount = totalAmount - paidAmount;

         form.setValue('dueAmount', parseFloat(dueAmount.toFixed(2)) || 0, {
            shouldDirty: false,
            shouldValidate: false,
         });
      }
   }, [watchProducts, form, rateMap]);

   const watchPaidAmount = useWatch({
      control: form.control,
      name: 'paidAmount',
   });

   useEffect(() => {
      const totalAmount = form.getValues('totalAmount') || 0;
      const paidAmount = watchPaidAmount || 0;
      const dueAmount = totalAmount - paidAmount;
      form.setValue('dueAmount', parseFloat(dueAmount.toFixed(2)) || 0, {
         shouldDirty: false,
         shouldValidate: false,
      });
   }, [watchPaidAmount, form]);

   const onSubmit = (invoice: InvoiceValues) => {
      setError(undefined);
      setIsSubmitting(true);

      startTransition(async () => {
         try {
            const { createdInvoice } = await createInvoice({ invoice });
            if (createdInvoice) {
               setCustomer(null);
               if (!isMember) {
                  setInvoiceCount(invoiceCount + 1);
               }
               form.reset({
                  customerId: '',
                  rateId: rates.id,
                  totalAmount: 0,
                  paidAmount: 0,
                  dueAmount: 0,
                  customerName: '',
                  customerPhone: '',
                  customerAddress: '',
                  products: [
                     {
                        description: '',
                        purity: '' as Purity,
                        netQuantity: 0,
                        GrossWeight: 0,
                        netStoneWeight: 0,
                        stonePrice: 0,
                        GrossProductPrice: 0,
                        MakingCharge: 0,
                        discount: 0,
                        CGST: 1.5,
                        SGST: 1.5,
                        productValue: 0,
                        CGSTAmount: 0,
                        SGSTAmount: 0,
                     },
                  ],
               });

               const fetchedInvoice = await kyInstance
                  .get(`/api/generateInvoice/${createdInvoice.id}`)
                  .json<InvoicePrintData>();

               if (fetchedInvoice) {
                  setInvoice(fetchedInvoice);
               }

               // const generateInvoice = await response.arrayBuffer();
               // const blob = new Blob([generateInvoice], {
               //    type: 'application/pdf',
               // });
               // const url = URL.createObjectURL(blob);
               // setPdfUrl(url);
            }
         } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again.');
         } finally {
            setIsSubmitting(false);
         }
      });
   };

   return (
      <div className="space-y-4 rounded-md border border-gray-200 p-5 shadow-sm">
         {!isMember && (
            <div className="text-destructive">
               {5 - invoiceCount} free invoices left
               <div className="space flex flex-col items-center gap-3 sm:flex-row">
                  <span className="text-muted-foreground">
                     Upgrade to premium for unlimited invoices
                  </span>
                  <Button
                     variant="default"
                     size="sm"
                     onClick={() => router.push('/membership')}
                     className="max-w-xs bg-green-700 hover:bg-green-900"
                  >
                     Become a Member
                  </Button>
               </div>
            </div>
         )}

         {!isMember && invoiceCount <= 5 && (
            <>
               <NewInvoiceDialog setCustomer={setCustomer} />

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4"
                  >
                     {error && (
                        <p className="text-center text-sm text-red-600">
                           {error}
                        </p>
                     )}

                     {/* Customer Fields with Small Labels and Placeholders */}
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                           control={form.control}
                           name="customerName"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-xs">Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Customer Name"
                                       className="text-sm"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="customerPhone"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-xs">
                                    Phone
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Customer Phone"
                                       className="text-sm"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="customerAddress"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-xs">
                                    Address
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Customer Address"
                                       className="text-sm"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {fields.map((field, index) => (
                        <div
                           key={field.id}
                           className="space-y-2 rounded-md border border-gray-300 bg-gray-50 p-3"
                        >
                           <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold">
                                 Product {index + 1}
                              </h3>
                              {index > 0 && (
                                 <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => remove(index)}
                                 >
                                    Remove
                                 </Button>
                              )}
                           </div>

                           {/* Product Fields in Grid */}
                           <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              {/* Description */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.description`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Description
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="Description"
                                             className="text-sm"
                                             {...field}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Purity */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.purity`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Purity
                                       </FormLabel>
                                       <Select
                                          onValueChange={(value) =>
                                             field.onChange(value)
                                          }
                                          value={field.value}
                                       >
                                          <FormControl>
                                             <SelectTrigger className="text-sm">
                                                <SelectValue placeholder="Select Purity" />
                                             </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                             {purityOptions.map((option) => (
                                                <SelectItem
                                                   key={option.value}
                                                   value={option.value}
                                                >
                                                   {option.label}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Net Quantity */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.netQuantity`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Net Quantity
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Net Quantity"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Gross Weight */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.GrossWeight`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Gross Weight (g)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Gross Weight"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Net Stone Weight */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.netStoneWeight`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Net Stone Weight (g)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Net Stone Weight"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Stone Price */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.stonePrice`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Stone Price (₹)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Stone Price"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Gross Product Price (calculated) */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.GrossProductPrice`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Gross Product Price (₹)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="0.00"
                                             className="bg-gray-100 text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             readOnly
                                          />
                                       </FormControl>
                                    </FormItem>
                                 )}
                              />

                              {/* Discount (%) */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.discount`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Discount (%)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="%"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Making Charge (%) */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.MakingCharge`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Making Charge (%)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="%"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* CGST (%) */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.CGST`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          CGST (%)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="%"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* SGST (%) */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.SGST`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          SGST (%)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="%"
                                             className="text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                   value === ''
                                                      ? 0
                                                      : parseFloat(value),
                                                );
                                             }}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Calculated CGST Amount */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.CGSTAmount`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          CGST Amount (₹)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="0.00"
                                             className="bg-gray-100 text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             readOnly
                                          />
                                       </FormControl>
                                    </FormItem>
                                 )}
                              />

                              {/* Calculated SGST Amount */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.SGSTAmount`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          SGST Amount (₹)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="0.00"
                                             className="bg-gray-100 text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             readOnly
                                          />
                                       </FormControl>
                                    </FormItem>
                                 )}
                              />

                              {/* Product Value (calculated) */}
                              <FormField
                                 control={form.control}
                                 name={`products.${index}.productValue`}
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-xs">
                                          Product Value (₹)
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="0.00"
                                             className="bg-gray-100 text-sm"
                                             {...field}
                                             value={field.value ?? ''}
                                             readOnly
                                          />
                                       </FormControl>
                                    </FormItem>
                                 )}
                              />
                           </div>
                        </div>
                     ))}

                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-sm"
                        onClick={() =>
                           append({
                              description: '',
                              purity: '' as Purity,
                              netQuantity: 0,
                              GrossWeight: 0,
                              netStoneWeight: 0,
                              stonePrice: 0,
                              GrossProductPrice: 0,
                              MakingCharge: 0,
                              discount: 0,
                              CGST: 1.5,
                              SGST: 1.5,
                              productValue: 0,
                              CGSTAmount: 0,
                              SGSTAmount: 0,
                           })
                        }
                     >
                        Add More Products
                     </Button>

                     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                           control={form.control}
                           name="totalAmount"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-xs">
                                    Total Amount (₹)
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="0.00"
                                       className="bg-gray-100 text-sm"
                                       {...field}
                                       value={field.value ?? ''}
                                       readOnly
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="paidAmount"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-xs">
                                    Paid Amount (₹)
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       placeholder="Paid Amount"
                                       className="text-sm"
                                       {...field}
                                       value={field.value ?? ''}
                                       onChange={(e) => {
                                          const value = e.target.value;
                                          field.onChange(
                                             value === ''
                                                ? 0
                                                : parseFloat(value),
                                          );
                                       }}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="dueAmount"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-xs">
                                    Due Amount (₹)
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="0.00"
                                       className="bg-gray-100 text-sm"
                                       {...field}
                                       value={field.value ?? ''}
                                       readOnly
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="space-y-2">
                        <LoadingButton
                           loading={isPending}
                           type="submit"
                           className="w-full text-sm"
                        >
                           Create Invoice
                        </LoadingButton>
                     </div>
                     {
                        <div>
                           
                           {/*className="w- absolute inset-0 m-32 h-fit space-y-3 bg-white p-4 shadow-2xl" */}
                           <InvoiceDialoag
                              invoice={invoice}
                              setInvoice={setInvoice}
                           />
                        </div>
                     }

                     <DevTool control={form.control} />
                  </form>
               </Form>
            </>
         )}
      </div>
   );
};

interface NewInvoiceDialogProps {
   setCustomer: (customer: Customer) => void;
}

const NewInvoiceDialog = ({ setCustomer }: NewInvoiceDialogProps) => {
   const [isPending, startTransaction] = useTransition();
   const [error, setError] = useState<string>();

   const [mobileNumber, setMobileNumber] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      startTransaction(async () => {
         try {
            const customer = await kyInstance
               .post('/api/customers/search', { json: { mobileNumber } })
               .json<Customer>();
            setCustomer(customer);
            setMobileNumber('');
         } catch (error) {
            console.error(error);
            setError('Customer not found');
            setTimeout(() => {
               setError(undefined);
            }, 3000);
         }
      });
   };

   return (
      <>
         {error && <p className="text-center text-destructive">{error}</p>}

         <form
            onSubmit={handleSubmit}
            className="mx-auto flex items-center gap-3 bg-card"
         >
            <Input
               className=""
               placeholder="Mobile Number"
               value={mobileNumber}
               onChange={(e) => setMobileNumber(e.target.value)}
            />
            <LoadingButton loading={isPending} type="submit">
               Add Invoice
            </LoadingButton>
           
         </form>
      </>
   );
};

export default InvoiceForm;
