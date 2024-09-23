'use server';

import { lucia } from '@/auth';
import prisma from '@/lib/prisma';
import { signUpSchema, type SignUpValues } from '@/lib/validation';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
const { redirect } = require('next/navigation');

import { isRedirectError } from 'next/dist/client/components/redirect';

import { cookies } from 'next/headers';

export const signUp = async (
   credentials: SignUpValues,
): Promise<{ error: string }> => {
   try {
      const { email, username, password, companyName, address } = signUpSchema.parse(credentials);

      const passwordHash = await hash(password, {
         memoryCost: 19456,
         timeCost: 2,
         outputLen: 32,
         parallelism: 1,
      });

      const userId = generateIdFromEntropySize(10);
      const existingUsername = await prisma.user.findFirst({
         where: {
            username: {
               equals: username,
               mode: 'insensitive',
            },
         },
      });
      if (existingUsername) {
         return {
            error: 'Username already exists',
         };
      }

      const existingEmail = await prisma.user.findFirst({
         where: {
            email: {
               equals: email,
               mode: 'insensitive',
            },
         },
      });
      if (existingEmail) {
         return {
            error: 'Email already exists',
         };
      }

      await prisma.user.create({
         data: {
            id: userId,
            email,
            username,
            passwordHash,
            displayName: username,
            companyName,
            address,
         },
      });

      const session = await lucia.createSession(userId, {});
      const sessioCookie = lucia.createSessionCookie(session.id);

      cookies().set(
         sessioCookie.name,
         sessioCookie.value,
         sessioCookie.attributes,
      );

      return redirect('/');
   } catch (error) {
      if (isRedirectError(error)) throw error;
      console.error(error);
      return {
         error: 'An error occurred',
      };
   }
};
