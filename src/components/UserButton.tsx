'use client';

import logOut from '@/app/(auth)/actions';
import { useSessionContext } from '@/app/(main)/SessionContextProvider';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuPortal,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';
import {
   Calendar,
   LogOutIcon,
   SubscriptIcon,
   UserIcon,
   UserPlus,
   UserRoundPlusIcon,
} from 'lucide-react';
import { getRemainingDays } from '@/lib/membershipUtils';
import Link from 'next/link';

const handleLogout = async () => {
   await logOut();
};

const UserButton = () => {
   const { userData } = useSessionContext();

   return (
      <div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <button className={cn('flex-none rounded-full')}>
                  <UserAvatar size={40} />
               </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuLabel>
                  logged in as @{userData.displayName}
               </DropdownMenuLabel>
      

               <DropdownMenuSeparator />

               <DropdownMenuItem>
                  {userData.isMember && userData.membershipEnd ? (
                     <>
                        <UserIcon className="mr-2 size-4 text-orange-700" />{' '}
                        <span className="text-orange-700">{getRemainingDays(userData.membershipEnd)} days left</span>
                     </>
                  ) : (
                     <>
                        <Link href="/membership" className='flex'>
                        <UserRoundPlusIcon className="mr-2 size-4" /> Subscribe
                        </Link>
                     </>
                  )}
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 size-4" />
                  Logout
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default UserButton;
