import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import fs from 'fs';
import handlers from 'handlebars';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const GET = async (
   req: Request,
   { params: { invoiceId } }: { params: { invoiceId: string } },
) => {
   try {
      const { user } = await validateRequest();
      if (!user) return new NextResponse('Unauthorized', { status: 403 });

      const invoice = await prisma.invoice.findUnique({
         where: {
            id: invoiceId,
         },
         include: {
            products: true,
            customer: true,
            rate: true,
            user: true,
         },
      });

      if (!invoice) return new NextResponse('Not found', { status: 404 });

      const file = fs.readFileSync(
         'src/app/api/generateInvoice/[invoiceId]/htmlTemplate.html',
         'utf8',
      );

      const template = handlers.compile(`${file}`);

      handlers.registerHelper(
         'startsWith',
         function (str: string, prefix: string) {
            if (typeof str === 'string' && typeof prefix === 'string') {
               return str.startsWith(prefix);
            }
            return false;
         },
      );
      handlers.registerHelper(
         'substring',
         function (str: string, start: number, length?: number) {
            if (typeof str === 'string') {
               if (length !== undefined) {
                  return str.substring(start, start + length);
               }
               return str.substring(start);
            }
            return '';
         },
      );

      handlers.registerHelper('multiply', function (a: number, b: number) {
         const numA = parseFloat(a as any);
         const numB = parseFloat(b as any);
         if (!isNaN(numA) && !isNaN(numB)) {
            return (numA * numB).toFixed(2);
         }
         return '0.00';
      });

      handlers.registerHelper(
         'sum',
         function (array: any[], property: string) {
            if (Array.isArray(array) && typeof property === 'string') {
               return array
                  .reduce((sum, item) => {
                     const value = parseFloat(item[property]);
                     return sum + (isNaN(value) ? 0 : value);
                  }, 0)
                  .toFixed(2);
            }
            return '0.00';
         },
      );

      const html = template({ invoice });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({ format: 'A4' });

      await browser.close();

      return new NextResponse(pdf, {
         headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="invoice_${invoice.customer.name}.pdf"`,
         },
      });
   } catch (error) {
      console.error(error);
      return new NextResponse('Internal server error', { status: 500 });
   }
};
