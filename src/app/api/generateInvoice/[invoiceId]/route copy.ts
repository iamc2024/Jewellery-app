// src/app/api/generateInvoice/[invoiceId]/route.js

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import handlers from 'handlebars';
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export const GET = async (
   req: Request,
   { params: { invoiceId } }: { params: { invoiceId: string } },
) => {
   try {
      // Validate the request
      const { user } = await validateRequest();
      if (!user) return new NextResponse('Unauthorized', { status: 403 });

      // Fetch the invoice
      const invoice = await prisma.invoice.findUnique({
         where: { id: invoiceId },
         include: {
            products: true,
            customer: true,
            rate: true,
            user: true,
         },
      });

      if (!invoice) return new NextResponse('Not found', { status: 404 });

      // Construct absolute path to htmlTemplate.html
      const templatePath = path.join(
         process.cwd(),
         'src',
         'app',
         'api',
         'generateInvoice',
         '[invoiceId]',
         'htmlTemplate.html',
      );

      // Check if the template exists
      if (!fs.existsSync(templatePath)) {
         console.error(
            'htmlTemplate.html does NOT exist at the resolved path.',
         );
         return new NextResponse('Template not found', { status: 500 });
      }

      // Read the HTML template
      const file = fs.readFileSync(templatePath, 'utf8');
      const template = handlers.compile(file);

      // Register Handlebars helpers
      handlers.registerHelper('startsWith', function (str, prefix) {
         if (typeof str === 'string' && typeof prefix === 'string') {
            return str.startsWith(prefix);
         }
         return false;
      });

      handlers.registerHelper('substring', function (str, start, length) {
         if (typeof str === 'string') {
            if (length !== undefined) {
               return str.substring(start, start + length);
            }
            return str.substring(start);
         }
         return '';
      });

      handlers.registerHelper('multiply', function (a, b) {
         const numA = parseFloat(a);
         const numB = parseFloat(b);
         if (!isNaN(numA) && !isNaN(numB)) {
            return (numA * numB).toFixed(2);
         }
         return '0.00';
      });

      handlers.registerHelper('sum', function (array, property) {
         if (Array.isArray(array) && typeof property === 'string') {
            return array
               .reduce((sum, item) => {
                  const value = parseFloat(item[property]);
                  return sum + (isNaN(value) ? 0 : value);
               }, 0)
               .toFixed(2);
         }
         return '0.00';
      });

      // Generate HTML with Handlebars
      const html = template({ invoice });

      // Create a PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      
      const fontPath = path.join(
         process.cwd(),
         'src',
         'assets',
         'open-sans',
         'OpenSans-Regular.ttf',
      );
      if (fs.existsSync(fontPath)) {
         doc.registerFont('OpenSans', fontPath);
         doc.font('OpenSans');
      } else {
         console.warn('Custom font not found. Using default Helvetica.');
         doc.font('Helvetica');
      }


      // Prepare to capture the PDF buffer
      const stream = new PassThrough();
      const response = new NextResponse(stream, {
         headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="invoice_${invoice.customer.name}.pdf"`,
         },
      });

      // Pipe the PDF document to the stream
      doc.pipe(stream);

      // PDF Content Generation
      // Customize this section based on your Handlebars template and data structure

      // Example Layout:
      // Add a company logo if you have one
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
         doc.image(logoPath, 50, 45, { width: 50 });
      }

      // Add company name and contact information
      doc.fontSize(20)
         .text('Your Company Name', 110, 57)
         .fontSize(10)
         .text('Your Company Address', 200, 50, { align: 'right' })
         .text('City, State, ZIP', 200, 65, { align: 'right' })
         .text('Email: your-email@example.com', 200, 80, { align: 'right' })
         .moveDown();

      // Add Invoice Title
      doc.fontSize(15)
         .text('Invoice', 50, 160)
         .fontSize(10)
         .text(`Invoice ID: ${invoice.id}`, 50, 185)
         .text(
            `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`,
            50,
            200,
         )
         .text(`Customer: ${invoice.customer.name}`, 50, 215)
         .moveDown();

      // Add Products Table Header
      doc.fontSize(12)
         .text('Product', 50, 250, { bold: true })
         .text('Quantity', 250, 250, { bold: true })
         .text('Price', 350, 250, { bold: true })
         .text('Total', 450, 250, { bold: true });

      // Add a horizontal line
      doc.moveTo(50, 265).lineTo(550, 265).stroke();

      // Add Products
      let y = 275;
      invoice.products.forEach((product) => {
         doc.fontSize(10)
            .text(product.name, 50, y)
            .text(product.quantity.toString(), 250, y)
            .text(`$${product.price.toFixed(2)}`, 350, y)
            .text(`$${(product.quantity * product.price).toFixed(2)}`, 450, y);
         y += 20;
      });

      // Add a horizontal line before total
      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 10;

      // Add Total
      const total = invoice.products.reduce(
         (acc, product) => acc + product.quantity * product.price,
         0,
      );
      doc.fontSize(12).text(`Total: $${total.toFixed(2)}`, 350, y, {
         align: 'right',
      });

      // Add Footer
      doc.fontSize(10).text('Thank you for your business!', 50, y + 50, {
         align: 'center',
      });

      // Finalize the PDF and end the stream
      doc.end();

      return response;
   } catch (error) {
      console.error(error);
      return new NextResponse('Internal server error', { status: 500 });
   }
};

// here we go

/*

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import fs from 'fs';
import handlers from 'handlebars';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

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

      handlers.registerHelper('sum', function (array: any[], property: string) {
         if (Array.isArray(array) && typeof property === 'string') {
            return array
               .reduce((sum, item) => {
                  const value = parseFloat(item[property]);
                  return sum + (isNaN(value) ? 0 : value);
               }, 0)
               .toFixed(2);
         }
         return '0.00';
      });

      const html = template({ invoice });

      const browser = await puppeteer.launch({
         args: chromium.args,
         defaultViewport: chromium.defaultViewport,
         executablePath: await chromium.executablePath(),
         headless: chromium.headless,
      });
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

*/
