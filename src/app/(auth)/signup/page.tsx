import type { Metadata } from 'next';
import { title } from 'process';
import Image from 'next/image';
import signUpImage from '@/assets/signup.png';
import SignUpForm from './SignUpForm';
import Link from 'next/link';

export const metadata: Metadata = {
   title: 'Sign Up',
};

const SignUpPage = () => {
   return (
      <main className="flex h-screen items-center justify-center p-5">
         <div className='flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl shadow-2xl bg-card'>
            <div className='w-full space-y-10 overflow-y-auto p-10 md:w-1/2'>
               <div className='space-y-1 text-center'>
                    <h1 className='text-3xl font-bold'>Sign up</h1>
                    <p className='text-muted-foreground'>sign up to this app</p>
               </div>
               <div >
                    <SignUpForm />
               </div>
               <Link href='/login' className='block text-center hover:underline'>already have an account? Log in</Link>
            </div>
            <Image src={signUpImage} alt="Sign Up" className='hidden w-1/2 object-cover md:block' />
         </div>
      </main>
   );
};

export default SignUpPage;
