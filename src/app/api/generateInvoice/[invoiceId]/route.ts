import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path'; // Import path
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

    // Construct absolute path
    const templatePath = path.join(
      process.cwd(),
      'src',
      'app',
      'api',
      'generateInvoice',
      '[invoiceId]',
      'htmlTemplate.html'
    );

    const file = fs.readFileSync(templatePath, 'utf8');

    const template = handlers.compile(`${file}`);

    // Register Handlebars helpers...

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
