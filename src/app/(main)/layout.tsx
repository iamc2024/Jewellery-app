import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import Navbar from './Navbar';
import SessionContextProvider from './SessionContextProvider';
import Menubar from './Menubar';
import prisma from '@/lib/prisma';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
   const session  = await validateRequest();
   
   if (!session.user) {
      redirect('/login');
   }
   

   const userData = await prisma.user.findUnique({
      where: {
         id: session.user.id,
      },
   })
   if(!userData) {
      redirect('/login');
   }

   const sessionContextValue = {
      user: session.user,
      session: session.session,
      userData: userData,
   }

   return (
      <SessionContextProvider value={sessionContextValue}>
         <div>
            <Navbar userData={userData}/>
            <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5 min-h-screen">
               <Menubar className="sticky bottom-0 hidden h-fit flex-none space-y-3 rounded-sm px-3 py-5 sm:block lg:px-5 xl:w-80" />
               {children}
            </div>
            <Menubar className="bg-card sticky bottom-0 flex w-full items-center justify-center gap-5 border-t p-3 sm:hidden" />
         </div>
      </SessionContextProvider>
   );
};

export default MainLayout;
