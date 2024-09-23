import logoImage from '@/assets/website logo.png';
import UserButton from '@/components/UserButton';
import type { User } from '@prisma/client';
import Image from 'next/image';

import Link from 'next/link';

const Navbar = ({ userData }: { userData: User }) => {
   return (
      <nav className="sticky top-0 z-10 bg-card shadow-sm">
         <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-3">
            <Link href={'/'}>
               <Image
                  src={logoImage}
                  alt="logo"
                  width={150}
                  height={150}
                  className="w-28 invert sm:w-full"
               />
            </Link>
            <UserButton />
         </div>
      </nav>
   );
};

export default Navbar;
