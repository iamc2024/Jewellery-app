import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import {assignMembership} from '@/lib/membershipUtils';

const generatedSignature = (
 razorpayOrderId: string,
 razorpayPaymentId: string
) => {
 const keySecret = process.env.key_secret;
 if (!keySecret) {
  throw new Error(
   'Razorpay key secret is not defined in environment variables.'
  );
 }
 const sig = crypto
  .createHmac('sha256', keySecret)
  .update(razorpayOrderId + '|' + razorpayPaymentId)
  .digest('hex');
 return sig;
};


export async function POST(request: NextRequest) {

    try {
        const {user} = await validateRequest()
    if (!user) {
        return NextResponse.json({ message: 'unauthorized', isOk: false }, { status: 401 });
    }


 const { orderCreationId, razorpayPaymentId, razorpaySignature, amount } =
  await request.json();

 const signature = generatedSignature(orderCreationId, razorpayPaymentId);
 if (signature !== razorpaySignature) {
  return NextResponse.json(
   { message: 'payment verification failed', isOk: false },
   { status: 400 }
  );
 }
 

const newMembership = await prisma.membership.create({
    data: {
        name: amount === 100 ? 'monthly' : amount === 1000 ? 'yearly' : 'unknown',
        price: amount,
        duration: amount === 100 ? 30 : amount === 1000 ? 365 : 30,
    },
});
  

  
  if(!newMembership){
    return NextResponse.json(
      { message: 'payment verified but failed to update membership', isOk: false },
      { status: 400 }
    );
  }

  await assignMembership(user.id, newMembership.id);

 return NextResponse.json(
  { message: 'payment verified successfully', isOk: true },
  { status: 200 }
 );
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'internal server error', isOk: false }, { status: 500 })
    }
}