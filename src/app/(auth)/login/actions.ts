'use server'

import { lucia } from '@/auth';
import prisma from '@/lib/prisma';
import { loginSchema, type LoginValues } from '@/lib/validation';
import { verify } from '@node-rs/argon2';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export const login = async (credentials: LoginValues) => {
   try {
      const { email, password } = loginSchema.parse(credentials);

      const existingUser = await prisma.user.findFirst({
         where: {
            email: {
               equals: email,
               mode: 'insensitive',
            },
         },
      });

      if (!existingUser || !existingUser.passwordHash) {
         return {
            error: 'Invalid email or password',
         };
      }

      const validPassword = await verify(existingUser.passwordHash, password, {
         memoryCost: 19456,
         timeCost: 2,
         outputLen: 32,
         parallelism: 1,
      });

      if (!validPassword) {
         return {
            error: 'Invalid email or password',
         };
      }

      const session = await lucia.createSession(existingUser.id, {});

      // Set the cookie before the redirect
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
         sessionCookie.name,
         sessionCookie.value,
         sessionCookie.attributes,
      );

      // Redirect only after setting the cookie
      redirect('/');
   } catch (error) {
      console.error(error);
      if (isRedirectError(error)) throw error;

      return {
         error: 'Something went wrong',
      };
   }
};

