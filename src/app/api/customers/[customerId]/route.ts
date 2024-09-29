import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (
    req: Request,
    { params: { customerId } }: { params: { customerId: string } },
) => {
    try {
        const { user } = await validateRequest();
        if (!user) return new NextResponse('Unauthorized', { status: 403 });

        const customer = await prisma.customer.findUnique({
            where: {
                id: customerId,
                user: {
                    id: user.id,
                }
            },
            include: {
                invoices: {
                    include: {
                        products: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!customer) return new NextResponse('Not found', { status: 404 });

        const invoices = customer.invoices.map(invoice => ({
            id: invoice.id,
            productCount: invoice.products.length,
            totalAmountPaid: invoice.paidAmount,
            dueAmount: invoice.dueAmount,
            createdAt: invoice.createdAt,
        }));

        const response = {
            customer: {
                id: customer.id,
                name: customer.name,
                mobileNumber: customer.mobileNumber,
                address: customer.address,
            },
            invoices,
        };

        return new NextResponse(JSON.stringify(response), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal server error', { status: 500 });
    }
};